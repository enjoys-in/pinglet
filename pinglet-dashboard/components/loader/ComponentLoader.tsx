"use client"
import React, { useState } from 'react';
import PingletLoader from './PingletLoader';
import { Component, RefreshCw } from 'lucide-react';

const ComponentLoader: React.FC = () => {
  const [showPageLoader, setShowPageLoader] = useState(false);
  const [isComponentLoading, setIsComponentLoading] = useState(false);

  const triggerPageLoader = () => {
    setShowPageLoader(true);
    setTimeout(() => setShowPageLoader(false), 3000);
  };

  const triggerComponentLoader = () => {
    setIsComponentLoading(true);
    setTimeout(() => setIsComponentLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Page loader overlay */}
      {showPageLoader && (
        <PingletLoader variant="page" message="Initializing Pinglet service..." />
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Pinglet Loader Components</h1>
          <p className="text-xl text-gray-600">Beautiful loading experiences for your push notification service</p>
        </div>

        {/* Demo Controls */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={triggerPageLoader}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Show Page Loader</span>
          </button>
          <button
            onClick={triggerComponentLoader}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Show Component Loader</span>
          </button>
        </div>

        {/* Loader Examples Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Component Loader */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Component Loader</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-lg min-h-[200px]">
              {isComponentLoading ? (
                <PingletLoader variant="component" message="Fetching notifications..." />
              ) : (
                <div className="flex items-center justify-center h-[200px] text-gray-500">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                      📱
                    </div>
                    <p>Notification content loaded!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Small Loader */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Small Loader</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Sending notification</span>
               
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Status:</span>
                <PingletLoader variant="small" />
              </div>
            </div>
          </div>

          {/* Branded Loader */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Branded Loader</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-lg">
              <PingletLoader 
                variant="component" 
                message="Connecting to Pinglet servers..." 
                showBrand={true}
              />
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Usage Examples</h3>
          <div className="space-y-4 text-gray-700">
            <div className="bg-gray-50 p-4 rounded-lg">
              <code className="text-sm">
                {`<PingletLoader variant="page" message="Loading..." />`}
              </code>
              <p className="text-sm text-gray-600 mt-2">Full-page overlay loader</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <code className="text-sm">
                {`<PingletLoader variant="component" message="Fetching notifications..." />`}
              </code>
              <p className="text-sm text-gray-600 mt-2">Component-level loader</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <code className="text-sm">
                {`<PingletLoader variant="small" showBrand={false} />`}
              </code>
              <p className="text-sm text-gray-600 mt-2">Compact loader without branding</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentLoader;