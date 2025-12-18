import { useState, useRef } from 'react';
import { FaImage, FaFile, FaFlask, FaUpload, FaSpinner } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function MultiModalInput({ onAnalysisComplete }) {
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [mode, setMode] = useState('image'); // 'image', 'document', 'structure'
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    setUploading(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      const endpoint = type === 'structure' 
        ? '/vision/recognize-structure'
        : type === 'document'
        ? '/vision/process-document'
        : '/vision/analyze-image';

      formData.append(type === 'document' ? 'document' : 'image', file);

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setAnalysisResult(response.data);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(response.data);
      }

      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to analyze file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Multi-Modal Analysis</h3>
        <p className="text-sm text-gray-600">
          Upload images, documents, or molecular structures for AI-powered analysis
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('image')}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${
            mode === 'image'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaImage />
          Image Analysis
        </button>
        <button
          onClick={() => setMode('document')}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${
            mode === 'document'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaFile />
          Document
        </button>
        <button
          onClick={() => setMode('structure')}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${
            mode === 'structure'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaFlask />
          Structure
        </button>
      </div>

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          ref={mode === 'document' ? fileInputRef : imageInputRef}
          type="file"
          accept={
            mode === 'document' 
              ? '.pdf,.docx,.doc'
              : mode === 'structure'
              ? 'image/*'
              : 'image/*'
          }
          className="hidden"
          onChange={(e) => {
            if (e.target.files[0]) {
              handleFileUpload(e.target.files[0], mode);
            }
          }}
        />

        {uploading ? (
          <div>
            <FaSpinner className="mx-auto text-4xl text-blue-600 mb-4 animate-spin" />
            <p className="text-gray-600">Analyzing {mode}...</p>
          </div>
        ) : (
          <div>
            {mode === 'image' && (
              <>
                <FaImage className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Upload an image for analysis</p>
                <p className="text-xs text-gray-500 mb-4">
                  Extract molecules, indications, trials, patents from images
                </p>
              </>
            )}
            {mode === 'document' && (
              <>
                <FaFile className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Upload a document (PDF, DOCX)</p>
                <p className="text-xs text-gray-500 mb-4">
                  Process pharmaceutical documents and extract key information
                </p>
              </>
            )}
            {mode === 'structure' && (
              <>
                <FaFlask className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Upload molecular structure image</p>
                <p className="text-xs text-gray-500 mb-4">
                  Recognize molecular structures and extract SMILES notation
                </p>
              </>
            )}
            <button
              onClick={() => {
                if (mode === 'document') {
                  fileInputRef.current?.click();
                } else {
                  imageInputRef.current?.click();
                }
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 mx-auto"
            >
              <FaUpload />
              Choose File
            </button>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-3">Analysis Results</h4>
          
          {analysisResult.analysis?.extracted_data && (
            <div className="space-y-3 text-sm">
              {analysisResult.analysis.extracted_data.molecules?.length > 0 && (
                <div>
                  <span className="font-medium">Molecules: </span>
                  <span className="text-gray-700">
                    {analysisResult.analysis.extracted_data.molecules.join(', ')}
                  </span>
                </div>
              )}
              {analysisResult.analysis.extracted_data.indications?.length > 0 && (
                <div>
                  <span className="font-medium">Indications: </span>
                  <span className="text-gray-700">
                    {analysisResult.analysis.extracted_data.indications.join(', ')}
                  </span>
                </div>
              )}
              {analysisResult.analysis.extracted_data.trials?.length > 0 && (
                <div>
                  <span className="font-medium">Clinical Trials: </span>
                  <span className="text-gray-700">
                    {analysisResult.analysis.extracted_data.trials.join(', ')}
                  </span>
                </div>
              )}
              {analysisResult.analysis.extracted_data.patents?.length > 0 && (
                <div>
                  <span className="font-medium">Patents: </span>
                  <span className="text-gray-700">
                    {analysisResult.analysis.extracted_data.patents.join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}

          {analysisResult.structure?.structure_data && (
            <div className="mt-3 p-3 bg-white rounded">
              <h5 className="font-medium mb-2">Molecular Structure Data:</h5>
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                {JSON.stringify(analysisResult.structure.structure_data, null, 2)}
              </pre>
            </div>
          )}

          {analysisResult.analysis?.text && (
            <div className="mt-3 p-3 bg-white rounded">
              <h5 className="font-medium mb-2">Extracted Text:</h5>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {analysisResult.analysis.text.substring(0, 500)}
                {analysisResult.analysis.text.length > 500 && '...'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
