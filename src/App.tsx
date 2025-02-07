import React, { useState, useEffect } from 'react';
import {
  Network,
  Plug,
  Settings,
  Activity,
  Database,
  AlertCircle,
  Search,
  Filter,
  BarChart2,
  Clock,
  Zap,
  RefreshCw,
  ChevronDown,
  FileText,
  Download,
  FolderTree,
  Bell,
  Upload,
  Users,
  Lock,
  History,
  Terminal,
  Layers,
  Cpu
} from 'lucide-react';

interface IEDDevice {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'pending';
  lastSeen: string;
  ip: string;
  manufacturer: string;
  model: string;
  dataPoints: number;
  firmwareVersion: string;
  logicalDevices: {
    name: string;
    nodes: { name: string; type: string }[];
  }[];
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error';
  message: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'devices' | 'config' | 'monitor' | 'logs'>('devices');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showDeviceDetails, setShowDeviceDetails] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '2024-03-15 10:30:22',
      type: 'info',
      message: '设备 Protection IED 已成功连接'
    },
    {
      id: '2',
      timestamp: '2024-03-15 10:30:20',
      type: 'warning',
      message: '设备 Bay Controller 通信质量下降'
    }
  ]);

  const [devices, setDevices] = useState<IEDDevice[]>([
    {
      id: '1',
      name: 'Protection IED',
      type: 'P645',
      status: 'connected',
      lastSeen: '2024-03-15 10:30:22',
      ip: '192.168.1.100',
      manufacturer: 'ABB',
      model: 'REF615',
      dataPoints: 486,
      firmwareVersion: '1.2.3',
      logicalDevices: [
        {
          name: 'PROT',
          nodes: [
            { name: 'LLN0', type: 'LLN0' },
            { name: 'PTOC1', type: 'PTOC' },
            { name: 'XCBR1', type: 'XCBR' }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Merging Unit',
      type: 'MU615',
      status: 'connected',
      lastSeen: '2024-03-15 10:30:20',
      ip: '192.168.1.101',
      manufacturer: 'Siemens',
      model: 'SIPROTEC',
      dataPoints: 324,
      firmwareVersion: '2.1.0',
      logicalDevices: [
        {
          name: 'MU01',
          nodes: [
            { name: 'LLN0', type: 'LLN0' },
            { name: 'TCTR1', type: 'TCTR' },
            { name: 'TVTR1', type: 'TVTR' }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Bay Controller',
      type: 'BCU615',
      status: 'pending',
      lastSeen: '2024-03-15 10:29:55',
      ip: '192.168.1.102',
      manufacturer: 'SEL',
      model: 'SEL-451',
      dataPoints: 474,
      firmwareVersion: '3.0.1',
      logicalDevices: [
        {
          name: 'BCU',
          nodes: [
            { name: 'LLN0', type: 'LLN0' },
            { name: 'CSWI1', type: 'CSWI' },
            { name: 'XCBR1', type: 'XCBR' }
          ]
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'text-blue-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || device.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const refreshData = () => {
    const updatedDevices = devices.map(device => ({
      ...device,
      lastSeen: new Date().toLocaleString()
    }));
    setDevices(updatedDevices);

    setLogs([
      {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        type: 'info',
        message: '数据已刷新'
      },
      ...logs
    ]);
  };

  const addDevice = () => {
    const newDevice: IEDDevice = {
      id: Date.now().toString(),
      name: 'New Device',
      type: 'P645',
      status: 'pending',
      lastSeen: new Date().toLocaleString(),
      ip: '192.168.1.103',
      manufacturer: 'Unknown',
      model: 'Unknown',
      dataPoints: 0,
      firmwareVersion: '1.0.0',
      logicalDevices: [
        {
          name: 'PROT',
          nodes: [
            { name: 'LLN0', type: 'LLN0' }
          ]
        }
      ]
    };
    setDevices([...devices, newDevice]);
    setLogs([
      {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        type: 'info',
        message: '新设备已添加'
      },
      ...logs
    ]);
  };

  const deleteDevice = (deviceId: string) => {
    const updatedDevices = devices.filter(device => device.id !== deviceId);
    setDevices(updatedDevices);
    setLogs([
      {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        type: 'info',
        message: `设备 ${deviceId} 已删除`
      },
      ...logs
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <Network className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">IEC 61850 设备管理</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
              <button onClick={refreshData} className="p-2 text-gray-400 hover:text-gray-600">
                <RefreshCw className="h-5 w-5" />
              </button>
              <button onClick={addDevice} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Plug className="h-4 w-4 mr-2" />
                添加设备
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('devices')}
                className={`${activeTab === 'devices'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Cpu className="h-4 w-4 mr-2" />
                设备管理
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`${activeTab === 'config'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Settings className="h-4 w-4 mr-2" />
                配置管理
              </button>
              <button
                onClick={() => setActiveTab('monitor')}
                className={`${activeTab === 'monitor'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Activity className="h-4 w-4 mr-2" />
                实时监控
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`${activeTab === 'logs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Terminal className="h-4 w-4 mr-2" />
                系统日志
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'devices' && (
          <>
            {/* Quick Actions */}
            <div className="mb-6 flex justify-between items-center">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-xs">
                  <input
                    type="text"
                    placeholder="搜索设备..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
                <div className="relative">
                  <select
                    className="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">所有状态</option>
                    <option value="connected">已连接</option>
                    <option value="disconnected">已断开</option>
                    <option value="pending">连接中</option>
                  </select>
                  <Filter className="h-4 w-4 text-gray-400 absolute right-3 top-3" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Upload className="h-4 w-4 mr-2" />
                  导入配置
                </button>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Download className="h-4 w-4 mr-2" />
                  导出配置
                </button>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <FileText className="h-4 w-4 mr-2" />
                  导出报告
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Plug className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">已连接设备</dt>
                        <dd className="text-lg font-medium text-gray-900">2</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-900">查看详情</a>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Activity className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">活跃连接</dt>
                        <dd className="text-lg font-medium text-gray-900">3</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-900">查看详情</a>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Database className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">数据点数</dt>
                        <dd className="text-lg font-medium text-gray-900">1,284</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-900">查看详情</a>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">告警数量</dt>
                        <dd className="text-lg font-medium text-gray-900">0</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-900">查看详情</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">通信质量</h3>
                  <BarChart2 className="h-6 w-6 opacity-75" />
                </div>
                <div className="text-3xl font-bold mb-2">95.5%</div>
                <p className="text-blue-100">过去24小时平均通信质量</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">系统运行时间</h3>
                  <Clock className="h-6 w-6 opacity-75" />
                </div>
                <div className="text-3xl font-bold mb-2">99.9%</div>
                <p className="text-green-100">本月系统可用性</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">数据传输</h3>
                  <Zap className="h-6 w-6 opacity-75" />
                </div>
                <div className="text-3xl font-bold mb-2">2.4 GB</div>
                <p className="text-purple-100">今日数据传输量</p>
              </div>
            </div>

            {/* Devices Table */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">设备列表</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        设备名称
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP地址
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        最后在线时间
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDevices.map((device) => (
                      <React.Fragment key={device.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <button
                                onClick={() => setShowDeviceDetails(showDeviceDetails === device.id ? null : device.id)}
                                className="text-sm font-medium text-gray-900 flex items-center"
                              >
                                {device.name}
                                <ChevronDown className={`h-4 w-4 ml-1 transform transition-transform ${showDeviceDetails === device.id ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{device.type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{device.ip}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(device.status)}`}>
                              {device.status === 'connected' ? '已连接' :
                                device.status === 'disconnected' ? '已断开' : '连接中'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {device.lastSeen}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Settings className="h-4 w-4" />
                              </button>
                              <button className="text-blue-600 hover:text-blue-900">
                                <Download className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900" onClick={() => deleteDevice(device.id)}>
                                断开
                              </button>
                            </div>
                          </td>
                        </tr>
                        {showDeviceDetails === device.id && (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">设备信息</h4>
                                  <dl className="mt-2 text-sm text-gray-900">
                                    <div className="mt-1">
                                      <dt className="inline text-gray-500">制造商：</dt>
                                      <dd className="inline">{device.manufacturer}</dd>
                                    </div>
                                    <div className="mt-1">
                                      <dt className="inline text-gray-500">型号：</dt>
                                      <dd className="inline">{device.model}</dd>
                                    </div>
                                    <div className="mt-1">
                                      <dt className="inline text-gray-500">固件版本：</dt>
                                      <dd className="inline">{device.firmwareVersion}</dd>
                                    </div>
                                  </dl>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">通信统计</h4>
                                  <dl className="mt-2 text-sm text-gray-900">
                                    <div className="mt-1">
                                      <dt className="inline text-gray-500">数据点数：</dt>
                                      <dd className="inline">{device.dataPoints}</dd>
                                    </div>
                                    <div className="mt-1">
                                      <dt className="inline text-gray-500">通信质量：</dt>
                                      <dd className="inline">98.5%</dd>
                                    </div>
                                    <div className="mt-1">
                                      <dt className="inline text-gray-500">响应时间：</dt>
                                      <dd className="inline">12ms</dd>
                                    </div>
                                  </dl>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">逻辑设备</h4>
                                  <div className="mt-2">
                                    {device.logicalDevices.map((ld, index) => (
                                      <div key={index} className="mb-2">
                                        <div className="font-medium text-gray-700">{ld.name}</div>
                                        <div className="pl-4">
                                          {ld.nodes.map((node, nodeIndex) => (
                                            <div key={nodeIndex} className="text-sm text-gray-600">
                                              {node.name} ({node.type})
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 flex justify-end space-x-3">
                                <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                  查看实时数据
                                </button>
                                <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                  配置参数
                                </button>
                                <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                  导出配置
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'config' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Project Tree */}
            <div className="col-span-3 bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">项目导航</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {devices.map(device => (
                    <div key={device.id} className="space-y-1">
                      <button
                        className="flex items-center w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                        onClick={() => setSelectedDevice(device.id)}
                      >
                        <FolderTree className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{device.name}</span>
                      </button>
                      {device.logicalDevices.map((ld, index) => (
                        <div key={index} className="pl-6 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Layers className="h-4 w-4 mr-2 text-gray-400" />
                            {ld.name}
                          </div>
                          {ld.nodes.map((node, nodeIndex) => (
                            <div key={nodeIndex} className="pl-6 text-sm text-gray-500">
                              {node.name}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Configuration Area */}
            <div className="col-span-9 bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">配置详情</h3>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <History className="h-4 w-4 mr-2" />
                    版本历史
                  </button>
                  <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    <Upload className="h-4 w-4 mr-2" />
                    保存配置
                  </button>
                </div>
              </div>
              <div className="p-6">
                {selectedDevice ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-4">基本配置</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">设备名称</label>
                            <input
                              type="text"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={devices.find(d => d.id === selectedDevice)?.name || ''}
                              onChange={(e) => {
                                const updatedDevices = devices.map(d =>
                                  d.id === selectedDevice ? { ...d, name: e.target.value } : d
                                );
                                setDevices(updatedDevices);
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">IP地址</label>
                            <input
                              type="text"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={devices.find(d => d.id === selectedDevice)?.ip || ''}
                              onChange={(e) => {
                                const updatedDevices = devices.map(d =>
                                  d.id === selectedDevice ? { ...d, ip: e.target.value } : d
                                );
                                setDevices(updatedDevices);
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">设备类型</label>
                            <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                              <option>保护装置</option>
                              <option>合并单元</option>
                              <option>智能终端</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-4">通信参数</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">GOOSE配置</label>
                            <div className="mt-1 space-y-2">
                              <input
                                type="text"
                                placeholder="AppID"
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                              <input
                                type="text"
                                placeholder="MAC地址"
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">MMS配置</label>
                            <div className="mt-1 space-y-2">
                              <input
                                type="text"
                                placeholder="端口号"
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                              <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option>认证模式</option>
                                <option>无认证</option>
                                <option>密码认证</option>
                                <option>证书认证</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-4">数据集配置</h4>
                      <div className="border border-gray-200 rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">数据集名称</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">描述</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">数据点数</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">GOOSE_Dataset_1</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">保护跳闸信号</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900">编辑</button>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">MMS_Dataset_1</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">测量值</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900">编辑</button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    请从左侧选择设备进行配置
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monitor' && (
          <div className="space-y-6">
            {/* Real-time Data */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">实时数据监控</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {devices.map(device => (
                    <div key={device.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-900">{device.name}</h4>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(device.status)}`}>
                          {device.status === 'connected' ? '已连接' :
                            device.status === 'disconnected' ? '已断开' : '连接中'}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">电压</span>
                          <span className="text-sm font-medium text-gray-900">220.5 kV</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">电流</span>
                          <span className="text-sm font-medium text-gray-900">1000.2 A</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">功率因数</span>
                          <span className="text-sm font-medium text-gray-900">0.95</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">频率</span>
                          <span className="text-sm font-medium text-gray-900">50.02 Hz</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Logs */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">系统日志</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        时间
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        消息
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.timestamp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex text-sm ${getLogTypeColor(log.type)}`}>
                            {log.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {log.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">系统日志</h3>
              <div className="flex space-x-2">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  筛选
                </button>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Download className="h-4 w-4 mr-2" />
                  导出日志
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      时间
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      设备
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      消息
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex text-sm ${getLogTypeColor(log.type)}`}>
                          {log.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Protection IED
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-900">详情</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;