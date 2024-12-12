import React, { useState, useEffect } from 'react';
import { Terminal, Power, Play, Square, Terminal as TerminalIcon } from 'lucide-react';
import { KaliManager } from '../utils/docker/kaliManager';
import type { DockerStatus } from '../utils/docker/types';

export const CLIMode: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [status, setStatus] = useState<DockerStatus | null>(null);
  const [command, setCommand] = useState('');

  const kaliManager = KaliManager.getInstance();

  useEffect(() => {
    setStatus(kaliManager.getStatus());
  }, []);

  const startKaliContainer = async () => {
    setLoading(true);
    try {
      setOutput(prev => [...prev, '> Starting Kali Linux container...']);
      await kaliManager.startContainer();
      setStatus(kaliManager.getStatus());
      setOutput(prev => [
        ...prev,
        '> Container started successfully',
        '> Kali Linux tools are now available',
        `> SSH Port: ${status?.ports.ssh}`,
        `> HTTP Port: ${status?.ports.http}`,
        `> HTTPS Port: ${status?.ports.https}`
      ]);
    } catch (error) {
      setOutput(prev => [...prev, `> Error: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };

  const stopContainer = async () => {
    setLoading(true);
    try {
      setOutput(prev => [...prev, '> Stopping Kali Linux container...']);
      await kaliManager.stopContainer();
      setStatus(kaliManager.getStatus());
      setOutput(prev => [...prev, '> Container stopped successfully']);
    } catch (error) {
      setOutput(prev => [...prev, `> Error: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };

  const executeCommand = async () => {
    if (!command.trim()) return;
    
    try {
      setOutput(prev => [...prev, `> ${command}`]);
      const result = await kaliManager.executeCommand(command);
      setOutput(prev => [...prev, result]);
      setCommand('');
    } catch (error) {
      setOutput(prev => [...prev, `> Error: ${error.message}`]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Terminal className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-bold">Kali Linux Terminal</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={startKaliContainer}
              disabled={loading || status?.isRunning}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Play className="w-4 h-4 mr-2" />
              Start
            </button>
            <button
              onClick={stopContainer}
              disabled={loading || !status?.isRunning}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </button>
          </div>
        </div>

        <div className="bg-black rounded-lg p-4 h-[500px] overflow-y-auto mb-4">
          {output.map((line, index) => (
            <div key={index} className="mb-2">{line}</div>
          ))}
          {loading && (
            <div className="animate-pulse">Loading...</div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
            placeholder="Enter command..."
            disabled={!status?.isRunning}
            className="flex-1 bg-gray-800 text-green-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={executeCommand}
            disabled={!status?.isRunning || !command.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <TerminalIcon className="w-4 h-4" />
          </button>
        </div>

        {status?.isRunning && (
          <div className="mt-4 text-sm text-gray-400">
            <p>Container ID: {status.containerId}</p>
            <p>SSH Port: {status.ports.ssh}</p>
            <p>HTTP Port: {status.ports.http}</p>
            <p>HTTPS Port: {status.ports.https}</p>
            {status.startTime && <p>Started: {new Date(status.startTime).toLocaleString()}</p>}
          </div>
        )}
      </div>
    </div>
  );
};