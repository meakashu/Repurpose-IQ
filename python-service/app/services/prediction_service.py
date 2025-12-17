"""
Predictive Analytics Service for Drug Repurposing
Provides ML-based predictions for repurposing success and market forecasting
"""

import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os
from loguru import logger
from datetime import datetime, timedelta

class PredictionService:
    """Service for predictive analytics in drug repurposing"""
    
    def __init__(self):
        self.models_dir = "models"
        os.makedirs(self.models_dir, exist_ok=True)
        self.models = {}
        self._load_models()
    
    def _load_models(self):
        """Load pre-trained models if available"""
        try:
            if os.path.exists(f"{self.models_dir}/repurposing_success.pkl"):
                self.models['repurposing_success'] = joblib.load(
                    f"{self.models_dir}/repurposing_success.pkl"
                )
                logger.info("Loaded repurposing success model")
            
            if os.path.exists(f"{self.models_dir}/market_forecast.pkl"):
                self.models['market_forecast'] = joblib.load(
                    f"{self.models_dir}/market_forecast.pkl"
                )
                logger.info("Loaded market forecast model")
        except Exception as e:
            logger.warning(f"Could not load models: {e}. Using heuristic-based predictions.")
    
    def predict_repurposing_success(
        self,
        molecule: str,
        indication: str,
        therapy_area: str,
        market_size: float = 0,
        competition_level: float = 0.5,
        patent_risk: str = "medium",
        clinical_evidence: float = 0.5,
        existing_indications: int = 1
    ) -> Dict[str, Any]:
        """
        Predict success probability of repurposing opportunity
        
        Args:
            molecule: Drug molecule name
            indication: Target indication
            therapy_area: Therapy area
            market_size: Market size in USD millions
            competition_level: Competition level (0-1)
            patent_risk: Patent risk level (low/medium/high)
            clinical_evidence: Clinical evidence strength (0-1)
            existing_indications: Number of existing approved indications
        
        Returns:
            Dictionary with prediction results
        """
        
        # Feature engineering
        features = {
            'market_size_log': np.log1p(max(market_size, 0)),
            'competition_level': float(competition_level),
            'patent_risk_high': 1 if patent_risk.lower() == 'high' else 0,
            'patent_risk_medium': 1 if patent_risk.lower() == 'medium' else 0,
            'patent_risk_low': 1 if patent_risk.lower() == 'low' else 0,
            'clinical_evidence': float(clinical_evidence),
            'existing_indications': int(existing_indications),
            'therapy_area_oncology': 1 if therapy_area.lower() == 'oncology' else 0,
            'therapy_area_diabetes': 1 if therapy_area.lower() == 'diabetes' else 0,
            'therapy_area_cardiovascular': 1 if therapy_area.lower() == 'cardiovascular' else 0,
            'therapy_area_respiratory': 1 if therapy_area.lower() == 'respiratory' else 0,
        }
        
        # If model exists, use it; otherwise use heuristic
        if 'repurposing_success' in self.models:
            try:
                model = self.models['repurposing_success']
                features_array = np.array([list(features.values())])
                probability = model.predict_proba(features_array)[0][1]
                confidence = 'high'
            except Exception as e:
                logger.warning(f"Model prediction failed: {e}. Using heuristic.")
                probability = self._heuristic_success_score(features)
                confidence = 'medium'
        else:
            # Heuristic-based prediction
            probability = self._heuristic_success_score(features)
            confidence = 'medium'
        
        return {
            'success_probability': float(probability),
            'confidence': confidence,
            'key_factors': self._identify_key_factors(features, probability),
            'recommendation': self._generate_recommendation(probability),
            'risk_factors': self._identify_risk_factors(features, probability),
            'molecule': molecule,
            'indication': indication,
            'therapy_area': therapy_area
        }
    
    def _heuristic_success_score(self, features: Dict) -> float:
        """Heuristic-based success scoring"""
        score = 0.5  # Base score
        
        # Market size impact (log scale)
        if features['market_size_log'] > 10:  # ~$22M+
            score += 0.15
        elif features['market_size_log'] > 8:  # ~$3M+
            score += 0.10
        elif features['market_size_log'] > 6:  # ~$400K+
            score += 0.05
        
        # Competition impact (lower is better)
        if features['competition_level'] < 0.3:
            score += 0.15
        elif features['competition_level'] < 0.5:
            score += 0.10
        elif features['competition_level'] > 0.7:
            score -= 0.10
        
        # Patent risk impact
        if features['patent_risk_low'] == 1:
            score += 0.10
        elif features['patent_risk_high'] == 1:
            score -= 0.15
        
        # Clinical evidence impact
        score += features['clinical_evidence'] * 0.15
        
        # Existing indications (more = better track record)
        if features['existing_indications'] > 2:
            score += 0.05
        elif features['existing_indications'] > 1:
            score += 0.03
        
        # Therapy area bonuses
        if features['therapy_area_oncology'] == 1:
            score += 0.05  # High-value area
        
        return min(1.0, max(0.0, score))
    
    def _identify_key_factors(self, features: Dict, probability: float) -> List[str]:
        """Identify key factors affecting prediction"""
        factors = []
        
        if features['market_size_log'] > 10:
            factors.append("Large market opportunity")
        elif features['market_size_log'] > 8:
            factors.append("Moderate market opportunity")
        
        if features['competition_level'] < 0.3:
            factors.append("Low competition")
        elif features['competition_level'] > 0.7:
            factors.append("High competition")
        
        if features['patent_risk_low'] == 1:
            factors.append("Low patent risk")
        elif features['patent_risk_high'] == 1:
            factors.append("High patent risk")
        
        if features['clinical_evidence'] > 0.7:
            factors.append("Strong clinical evidence")
        elif features['clinical_evidence'] < 0.3:
            factors.append("Limited clinical evidence")
        
        if features['existing_indications'] > 2:
            factors.append("Proven track record")
        
        return factors if factors else ["Moderate opportunity across all factors"]
    
    def _identify_risk_factors(self, features: Dict, probability: float) -> List[str]:
        """Identify risk factors"""
        risks = []
        
        if features['patent_risk_high'] == 1:
            risks.append("High patent risk may limit freedom to operate")
        
        if features['competition_level'] > 0.7:
            risks.append("High competition may reduce market share")
        
        if features['clinical_evidence'] < 0.3:
            risks.append("Limited clinical evidence increases regulatory risk")
        
        if features['market_size_log'] < 6:
            risks.append("Small market size may limit commercial viability")
        
        return risks
    
    def _generate_recommendation(self, probability: float) -> str:
        """Generate recommendation based on probability"""
        if probability > 0.75:
            return "Strong candidate - Highly recommend pursuing this opportunity"
        elif probability > 0.60:
            return "Good candidate - Recommend with careful evaluation"
        elif probability > 0.45:
            return "Moderate candidate - Further analysis recommended before commitment"
        elif probability > 0.30:
            return "Weak candidate - Consider only if strategic fit is strong"
        else:
            return "Low priority - Not recommended unless unique strategic value"
    
    def forecast_market_size(
        self,
        molecule: str,
        indication: str,
        current_market_size: float,
        cagr: float,
        years: int = 5,
        volatility: float = 0.1
    ) -> Dict[str, Any]:
        """
        Forecast market size over time
        
        Args:
            molecule: Drug molecule name
            indication: Target indication
            current_market_size: Current market size in USD millions
            cagr: Compound annual growth rate (percentage)
            years: Number of years to forecast
            volatility: Market volatility factor (0-1)
        
        Returns:
            Dictionary with forecast data
        """
        
        forecast = []
        base_size = current_market_size
        
        for year in range(1, years + 1):
            # Compound growth
            forecasted = base_size * (1 + cagr / 100) ** year
            
            # Add uncertainty based on volatility
            uncertainty = np.random.normal(0, volatility) * forecasted
            
            # Calculate bounds (85th and 15th percentiles)
            lower_bound = forecasted * (1 - volatility * 1.5)
            upper_bound = forecasted * (1 + volatility * 1.5)
            
            forecast.append({
                'year': year,
                'forecasted_size': float(max(0, forecasted + uncertainty)),
                'lower_bound': float(max(0, lower_bound)),
                'upper_bound': float(upper_bound),
                'cagr': cagr,
                'year_date': (datetime.now() + timedelta(days=365*year)).strftime('%Y')
            })
        
        # Calculate summary metrics
        projected_5yr = forecast[-1]['forecasted_size'] if forecast else current_market_size
        total_growth = ((projected_5yr / current_market_size) - 1) * 100 if current_market_size > 0 else 0
        
        return {
            'molecule': molecule,
            'indication': indication,
            'forecast': forecast,
            'current_size': current_market_size,
            'projected_size_5yr': projected_5yr,
            'total_growth_percent': total_growth,
            'average_annual_growth': total_growth / years if years > 0 else 0,
            'cagr': cagr
        }
    
    def predict_patent_expiry_impact(
        self,
        molecule: str,
        expiry_date: str,
        current_market_size: float
    ) -> Dict[str, Any]:
        """
        Predict market impact when patent expires
        
        Args:
            molecule: Drug molecule name
            expiry_date: Patent expiry date (YYYY-MM-DD)
            current_market_size: Current market size in USD millions
        
        Returns:
            Dictionary with impact predictions
        """
        try:
            expiry = datetime.strptime(expiry_date, '%Y-%m-%d')
            now = datetime.now()
            years_until_expiry = (expiry - now).days / 365.25
            
            if years_until_expiry < 0:
                years_until_expiry = 0
            
            # Typical generic penetration after patent expiry
            # Year 1: 10-20%, Year 2: 30-50%, Year 3: 50-70%, Year 5: 70-90%
            generic_penetration_curve = {
                1: 0.15,
                2: 0.40,
                3: 0.60,
                5: 0.80
            }
            
            # Price erosion (typically 80-90% reduction)
            price_erosion = 0.85
            
            # Market impact scenarios
            scenarios = []
            for year in [1, 2, 3, 5]:
                generic_penetration = generic_penetration_curve.get(year, 0.80)
                remaining_brand_share = 1 - generic_penetration
                
                # Brand revenue (reduced volume + price)
                brand_revenue = current_market_size * remaining_brand_share * (1 - price_erosion * generic_penetration)
                
                # Generic revenue (lower prices)
                generic_revenue = current_market_size * generic_penetration * (1 - price_erosion)
                
                total_market = brand_revenue + generic_revenue
                market_shrinkage = ((current_market_size - total_market) / current_market_size) * 100
                
                scenarios.append({
                    'year': year,
                    'years_from_expiry': year,
                    'generic_penetration': generic_penetration,
                    'brand_revenue': brand_revenue,
                    'generic_revenue': generic_revenue,
                    'total_market': total_market,
                    'market_shrinkage_percent': market_shrinkage
                })
            
            return {
                'molecule': molecule,
                'expiry_date': expiry_date,
                'years_until_expiry': years_until_expiry,
                'current_market_size': current_market_size,
                'scenarios': scenarios,
                'recommendation': self._generate_patent_recommendation(years_until_expiry)
            }
        except Exception as e:
            logger.error(f"Error predicting patent expiry impact: {e}")
            return {
                'molecule': molecule,
                'error': str(e)
            }
    
    def _generate_patent_recommendation(self, years_until_expiry: float) -> str:
        """Generate recommendation based on years until expiry"""
        if years_until_expiry > 5:
            return "Patent protection secure - Good time for market expansion"
        elif years_until_expiry > 3:
            return "Prepare for patent expiry - Consider lifecycle management strategies"
        elif years_until_expiry > 1:
            return "Patent expiry imminent - Implement generic competition strategies"
        else:
            return "Patent expired - Focus on differentiation and cost leadership"
    
    def train_repurposing_model(self, training_data: List[Dict]) -> Dict[str, Any]:
        """
        Train model on historical data
        
        Args:
            training_data: List of dictionaries with training examples
        
        Returns:
            Training results
        """
        try:
            df = pd.DataFrame(training_data)
            
            # Feature engineering
            feature_cols = [
                'market_size_log', 'competition_level', 'patent_risk_encoded',
                'clinical_evidence', 'therapy_area_encoded', 'existing_indications'
            ]
            
            # Check if required columns exist
            missing_cols = [col for col in feature_cols if col not in df.columns]
            if missing_cols:
                return {
                    'success': False,
                    'error': f'Missing columns: {missing_cols}'
                }
            
            X = df[feature_cols]
            y = df['success']  # Binary: 1 = success, 0 = failure
            
            # Train model
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            model = GradientBoostingClassifier(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=5,
                random_state=42
            )
            model.fit(X_train, y_train)
            
            # Save model
            joblib.dump(model, f"{self.models_dir}/repurposing_success.pkl")
            self.models['repurposing_success'] = model
            
            accuracy = model.score(X_test, y_test)
            logger.info(f"Model trained with accuracy: {accuracy:.2%}")
            
            return {
                'success': True,
                'accuracy': float(accuracy),
                'model_path': f"{self.models_dir}/repurposing_success.pkl"
            }
        except Exception as e:
            logger.error(f"Error training model: {e}")
            return {
                'success': False,
                'error': str(e)
            }

# Singleton instance
prediction_service = PredictionService()
