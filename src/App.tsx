import { useState } from 'react';
import { 
  Server, 
  Database, 
  Network, 
  Monitor, 
  ShieldAlert, 
  Cpu, 
  HardDrive, 
  Layers, 
  CheckCircle2, 
  PlayCircle, 
  BookOpen, 
  HelpCircle,
  PlusCircle,
  Power
} from 'lucide-react';

// --- DATA: NỘI DUNG BÀI HỌC ---
const CONCEPTS = [
  {
    id: 'intro',
    title: 'Ảo hóa & Hypervisor là gì?',
    icon: <Layers className="w-6 h-6 text-blue-500" />,
    content: 'Ảo hóa (Virtualization) là công nghệ cho phép tạo ra nhiều môi trường máy tính mô phỏng (máy ảo - VM) trên cùng một hệ thống phần cứng vật lý duy nhất. VMware sử dụng Hypervisor Loại 1 (Bare-metal), nghĩa là phần mềm ảo hóa cài TRỰC TIẾP lên phần cứng máy chủ mà không cần hệ điều hành nền (như Windows/Linux).',
    keyPoints: [
      'Tối ưu hóa tài nguyên phần cứng (CPU, RAM, Storage).',
      'Giảm chi phí mua sắm thiết bị, điện năng, không gian làm mát.',
      'Dễ dàng sao lưu, phục hồi và di chuyển hệ thống.'
    ],
    diagram: 'hypervisor'
  },
  {
    id: 'esxi',
    title: 'VMware ESXi (Host)',
    icon: <Server className="w-6 h-6 text-green-500" />,
    content: 'ESXi là linh hồn của vSphere. Nó là một Hypervisor (hệ điều hành tối giản) được cài đặt trực tiếp lên các máy chủ vật lý (Dell, HP, Lenovo...). Nhiệm vụ của ESXi là phân chia tài nguyên CPU, RAM, Disk, Network của máy chủ vật lý cho các máy ảo (VM) hoạt động bên trên nó.',
    keyPoints: [
      'Dung lượng cài đặt rất nhỏ (chỉ vài trăm MB).',
      'Bảo mật cao, ít lỗ hổng do kiến trúc tối giản.',
      'Quản lý trực tiếp qua giao diện Web (ESXi Host Client) hoặc dòng lệnh (ESXi Shell/SSH).'
    ],
    diagram: 'esxi'
  },
  {
    id: 'vcenter',
    title: 'vCenter Server (Bộ não quản lý)',
    icon: <Monitor className="w-6 h-6 text-purple-500" />,
    content: 'Nếu bạn có 10 máy chủ ESXi, bạn không thể đăng nhập vào từng máy để quản lý. vCenter Server là "bộ não" trung tâm. Nó gom tất cả các host ESXi lại thành một Cụm (Cluster) và cho phép bạn quản lý mọi thứ từ một màn hình duy nhất.',
    keyPoints: [
      'Bắt buộc phải có để dùng các tính năng cao cấp: vMotion, HA, DRS.',
      'Cung cấp giao diện vSphere Client (HTML5).',
      'Thường được triển khai dưới dạng một máy ảo đặc biệt gọi là vCenter Server Appliance (vCSA) chạy hệ điều hành Photon OS.'
    ],
    diagram: 'vcenter'
  },
  {
    id: 'storage',
    title: 'Datastore (Lưu trữ)',
    icon: <HardDrive className="w-6 h-6 text-orange-500" />,
    content: 'Datastore là nơi chứa các file cấu hình và ổ cứng ảo (.vmdk) của máy ảo. Trong môi trường doanh nghiệp, để các tính năng như HA, vMotion hoạt động, Datastore phải là LƯU TRỮ DÙNG CHUNG (Shared Storage) kết nối đến tất cả các host ESXi.',
    keyPoints: [
      'Các loại lưu trữ phổ biến: SAN (iSCSI, FC), NAS (NFS), hoặc vSAN (Software-Defined Storage).',
      'Định dạng hệ thống tập tin riêng của VMware gọi là VMFS.',
    ],
    diagram: 'storage'
  },
  {
    id: 'network',
    title: 'Virtual Network (vSwitch)',
    icon: <Network className="w-6 h-6 text-teal-500" />,
    content: 'Để máy ảo (VM) có thể giao tiếp with nhau và với mạng vật lý bên ngoài, ESXi sử dụng các Switch Ảo (vSwitch). Nó hoạt động giống như một Switch vật lý nhưng bằng phần mềm.',
    keyPoints: [
      'Standard vSwitch (vSS): Cấu hình trên từng host ESXi riêng lẻ.',
      'Distributed vSwitch (vDS): Cấu hình tập trung trên vCenter, tự động áp dụng cho tất cả các host (Dành cho bản quyền Enterprise Plus).',
      'Port Group: Nơi cắm "cáp mạng ảo" của VM vào vSwitch, thường dùng để chia VLAN.'
    ],
    diagram: 'network'
  },
  {
    id: 'advanced',
    title: 'vMotion, HA & DRS',
    icon: <ShieldAlert className="w-6 h-6 text-red-500" />,
    content: 'Đây là các tính năng "ăn tiền" nhất của VMware vSphere, yêu cầu phải có vCenter và Shared Storage.',
    keyPoints: [
      'vMotion: Di chuyển máy ảo ĐANG CHẠY từ host ESXi này sang host ESXi khác mà không rớt mạng (Zero downtime). Dùng khi cần bảo trì phần cứng.',
      'HA (High Availability): Nếu một host ESXi bị chết (cháy nguồn, hỏng RAM), vCenter sẽ tự động khởi động lại các VM trên các host ESXi còn sống. Thời gian downtime khoảng 1-2 phút.',
      'DRS (Distributed Resource Scheduler): Tự động di chuyển VM (dùng vMotion) để cân bằng tải (CPU/RAM) giữa các host ESXi trong Cụm.'
    ],
    diagram: 'advanced'
  }
];

// --- DATA: BÀI TRẮC NGHIỆM ---
const QUIZ_QUESTIONS = [
  {
    question: "Hypervisor Loại 1 (Bare-metal) có nghĩa là gì?",
    options: [
      "Phần mềm được cài đặt trên hệ điều hành Windows.",
      "Phần mềm được cài đặt trực tiếp lên phần cứng máy chủ, không qua HĐH trung gian.",
      "Là một loại máy ảo đặc biệt.",
      "Là trình duyệt web để quản lý."
    ],
    answer: 1
  },
  {
    question: "Để sử dụng tính năng vMotion (di chuyển máy ảo không gián đoạn), bạn BẮT BUỘC phải có những thành phần nào?",
    options: [
      "Chỉ cần 2 host ESXi.",
      "vCenter Server, 2 host ESXi và Local Storage trên mỗi host.",
      "vCenter Server, ít nhất 2 host ESXi và Shared Storage (Lưu trữ dùng chung).",
      "Chỉ cần vCenter Server."
    ],
    answer: 2
  },
  {
    question: "Tính năng nào sẽ tự động khởi động lại máy ảo trên một Host ESXi khác nếu Host ESXi hiện tại bị lỗi phần cứng đột ngột?",
    options: [
      "vMotion",
      "DRS (Distributed Resource Scheduler)",
      "vSphere HA (High Availability)",
      "Fault Tolerance (FT)"
    ],
    answer: 2
  },
  {
    question: "Sự khác biệt chính giữa Standard vSwitch (vSS) và Distributed vSwitch (vDS) là gì?",
    options: [
      "vSS dùng cho Windows, vDS dùng cho Linux.",
      "vSS quản lý tập trung trên vCenter, vDS cấu hình trên từng host.",
      "vSS cấu hình riêng lẻ trên từng Host ESXi, vDS được cấu hình tập trung tại vCenter và áp dụng xuống các Host.",
      "Không có sự khác biệt, chỉ là tên gọi khác nhau."
    ],
    answer: 2
  }
];

// Giả lập Component ArrowRight cho Diagram Advanced
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('concepts'); // concepts, simulator, quiz
  const [activeConceptId, setActiveConceptId] = useState(CONCEPTS[0].id);
  
  // States for Simulator
  const [simHosts, setSimHosts] = useState<any[]>([]); // [{ id: 1, vms: [] }]
  const [simVCenter, setSimVCenter] = useState(false);
  const [simStorage, setSimStorage] = useState(false);

  // States for Quiz
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const activeConcept = CONCEPTS.find(c => c.id === activeConceptId)!;

  // --- RENDER DIAGRAMS DỰA TRÊN CONCEPT ---
  const renderDiagram = (type: string) => {
    switch(type) {
      case 'hypervisor':
        return (
          <div className="flex flex-col items-center space-y-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex space-x-4">
              <div className="w-24 h-20 bg-blue-100 border-2 border-blue-400 rounded-lg flex flex-col items-center justify-center shadow-sm">
                <Monitor className="w-6 h-6 text-blue-600 mb-1" />
                <span className="text-xs font-semibold text-blue-800">VM 1 (Win)</span>
              </div>
              <div className="w-24 h-20 bg-blue-100 border-2 border-blue-400 rounded-lg flex flex-col items-center justify-center shadow-sm">
                <Monitor className="w-6 h-6 text-blue-600 mb-1" />
                <span className="text-xs font-semibold text-blue-800">VM 2 (Linux)</span>
              </div>
            </div>
            <div className="w-64 py-3 bg-green-100 border-2 border-green-500 rounded-lg text-center font-bold text-green-700 shadow-sm relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rotate-45"></div>
              Hypervisor (ESXi)
            </div>
            <div className="w-72 py-4 bg-gray-200 border-2 border-gray-400 rounded-lg text-center font-bold text-gray-700 shadow-md">
              <Server className="w-5 h-5 inline-block mr-2" />
              Phần cứng Vật lý (Server)
            </div>
          </div>
        );
      case 'vcenter':
        return (
          <div className="flex flex-col items-center space-y-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-48 py-3 bg-purple-100 border-2 border-purple-500 rounded-lg text-center font-bold text-purple-700 shadow-md flex items-center justify-center">
              <Monitor className="w-5 h-5 mr-2" />
              vCenter Server
            </div>
            <div className="flex space-x-2 w-full justify-center">
               <div className="w-px h-8 bg-purple-400"></div>
            </div>
            <div className="w-full flex justify-center border-t-2 border-purple-400 pt-4 px-4 gap-8">
               {/* Line connectors handled by border-t */}
               <div className="w-32 py-8 bg-green-50 border-2 border-green-500 rounded-lg text-center font-bold text-green-700 shadow-sm">
                  ESXi Host 1
               </div>
               <div className="w-32 py-8 bg-green-50 border-2 border-green-500 rounded-lg text-center font-bold text-green-700 shadow-sm">
                  ESXi Host 2
               </div>
               <div className="w-32 py-8 bg-green-50 border-2 border-green-500 rounded-lg text-center font-bold text-green-700 shadow-sm">
                  ESXi Host 3
               </div>
            </div>
          </div>
        );
      case 'storage':
        return (
          <div className="flex flex-col items-center space-y-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
             <div className="flex gap-12 mb-4">
               <div className="w-24 h-24 bg-green-50 border-2 border-green-500 rounded-lg flex flex-col items-center justify-center font-bold text-green-700">ESXi 1</div>
               <div className="w-24 h-24 bg-green-50 border-2 border-green-500 rounded-lg flex flex-col items-center justify-center font-bold text-green-700">ESXi 2</div>
             </div>
             
             {/* Storage Network Lines */}
             <div className="flex gap-20">
                <div className="w-1 h-12 bg-orange-300"></div>
                <div className="w-1 h-12 bg-orange-300"></div>
             </div>

             <div className="w-96 py-6 bg-orange-100 border-2 border-orange-500 rounded-xl flex flex-col items-center justify-center shadow-lg">
                <Database className="w-8 h-8 text-orange-600 mb-2" />
                <span className="font-bold text-orange-800 text-lg">Shared Storage (SAN/NAS)</span>
                <span className="text-sm text-orange-600 mt-1">Datastore (VMFS/NFS)</span>
             </div>
          </div>
        );
      case 'advanced':
         return (
            <div className="flex flex-col items-center p-6 bg-slate-50 rounded-xl border border-slate-200">
               <div className="flex w-full max-w-lg justify-between items-end relative h-48">
                  {/* Host 1 */}
                  <div className="w-32 h-32 bg-green-100 border-2 border-green-500 rounded-lg flex flex-col items-center justify-end pb-2 relative z-10">
                     <span className="font-bold text-green-700 text-sm">ESXi Host A</span>
                     <span className="text-xs text-green-600">CPU: 90% (Quá tải)</span>
                  </div>
                  
                  {/* VM moving */}
                  <div className="absolute top-4 left-10 w-20 h-16 bg-blue-500 rounded-md border border-blue-700 flex items-center justify-center text-white font-bold text-xs shadow-lg animate-bounce z-20">
                     VM (vMotion)
                     <ArrowRight className="w-4 h-4 ml-1" />
                  </div>

                  {/* Host 2 */}
                  <div className="w-32 h-32 bg-green-100 border-2 border-green-500 rounded-lg flex flex-col items-center justify-end pb-2 relative z-10">
                     <span className="font-bold text-green-700 text-sm">ESXi Host B</span>
                     <span className="text-xs text-green-600">CPU: 20% (Rảnh)</span>
                  </div>
               </div>
               <div className="w-full h-4 bg-orange-200 mt-2 rounded-full border border-orange-400"></div>
               <span className="text-xs text-gray-500 mt-1">Shared Storage (Đảm bảo dữ liệu không đổi chỗ)</span>
            </div>
         );
      default:
        return <div className="text-gray-400 italic flex justify-center items-center h-32">Hình ảnh minh họa đang được cập nhật...</div>;
    }
  };

  // --- MÔ PHỎNG (SIMULATOR) ACTIONS ---
  const addHost = () => {
    if (simHosts.length < 3) {
      setSimHosts([...simHosts, { id: Date.now(), vms: [] }]);
    }
  };

  const addVM = (hostId: number) => {
    if (!simStorage) {
      alert("Cảnh báo: Bạn nên có Shared Storage trước để an toàn dữ liệu, nhưng trong lab nhỏ có thể dùng Local Storage. Đã tạo VM trên Local Storage.");
    }
    setSimHosts(hosts => hosts.map(h => {
      if (h.id === hostId && h.vms.length < 4) {
        return { ...h, vms: [...h.vms, { id: Date.now(), name: `VM-${Math.floor(Math.random()*100)}` }] };
      }
      return h;
    }));
  };

  const removeHost = (id: number) => {
    setSimHosts(simHosts.filter(h => h.id !== id));
  };

  const resetSim = () => {
    setSimHosts([]);
    setSimVCenter(false);
    setSimStorage(false);
  }

  // --- QUIZ ACTIONS ---
  const handleQuizAnswer = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(index);
    setIsAnswerChecked(true);
    
    if (index === QUIZ_QUESTIONS[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedOption(null);
    setIsAnswerChecked(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-md z-10 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Layers className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold tracking-tight">vSphere Master</h1>
        </div>
        <nav className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('concepts')}
            className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${activeTab === 'concepts' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <BookOpen className="w-4 h-4 mr-2" /> Khái niệm
          </button>
          <button 
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${activeTab === 'simulator' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <PlayCircle className="w-4 h-4 mr-2" /> Lab Thực hành
          </button>
          <button 
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${activeTab === 'quiz' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <HelpCircle className="w-4 h-4 mr-2" /> Trắc nghiệm
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        
        {/* --- VIEW: CONCEPTS --- */}
        {activeTab === 'concepts' && (
          <div className="flex h-full">
            {/* Sidebar Modules */}
            <div className="w-1/4 bg-white border-r border-slate-200 overflow-y-auto">
              <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 uppercase text-xs tracking-wider">
                Lộ trình học tập
              </div>
              <ul className="flex flex-col">
                {CONCEPTS.map(concept => (
                  <li key={concept.id}>
                    <button
                      onClick={() => setActiveConceptId(concept.id)}
                      className={`w-full text-left px-6 py-4 flex items-center border-l-4 transition-all ${
                        activeConceptId === concept.id 
                          ? 'border-blue-500 bg-blue-50/50' 
                          : 'border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <span className="mr-3">{concept.icon}</span>
                      <span className={`font-medium ${activeConceptId === concept.id ? 'text-blue-700' : 'text-slate-600'}`}>
                        {concept.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content Detail */}
            <div className="w-3/4 p-10 overflow-y-auto bg-white">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    {activeConcept.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800">{activeConcept.title}</h2>
                </div>

                <div className="prose prose-blue max-w-none text-lg text-slate-600 leading-relaxed mb-8">
                  <p>{activeConcept.content}</p>
                </div>

                <div className="mb-10">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" /> Điểm mấu chốt
                  </h3>
                  <ul className="space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-100">
                    {activeConcept.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-slate-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Minh họa Kiến trúc</h3>
                  {renderDiagram(activeConcept.diagram)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: SIMULATOR --- */}
        {activeTab === 'simulator' && (
          <div className="h-full p-8 overflow-y-auto bg-slate-100">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                <h2 className="text-2xl font-bold mb-2 flex items-center">
                  <PlayCircle className="w-6 h-6 mr-2 text-blue-600" />
                  Trình mô phỏng Triển khai Datacenter
                </h2>
                <p className="text-slate-500 mb-6">Hãy tự tay xây dựng một cụm ảo hóa từ con số 0. Nhấn các nút bên dưới theo thứ tự để hiểu luồng triển khai thực tế.</p>
                
                <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <button 
                    onClick={addHost}
                    disabled={simHosts.length >= 3}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg font-medium flex items-center transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Thêm Máy chủ ESXi ({simHosts.length}/3)
                  </button>
                  <button 
                    onClick={() => setSimStorage(true)}
                    disabled={simStorage}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg font-medium flex items-center transition-colors"
                  >
                    <HardDrive className="w-4 h-4 mr-2" /> Mua Shared Storage (SAN)
                  </button>
                  <button 
                    onClick={() => setSimVCenter(true)}
                    disabled={simVCenter || simHosts.length === 0}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-lg font-medium flex items-center transition-colors"
                  >
                    <Monitor className="w-4 h-4 mr-2" /> Triển khai vCenter Server
                  </button>
                  <div className="flex-1"></div>
                  <button onClick={resetSim} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium">Làm lại</button>
                </div>
              </div>

              {/* Infrastructure Visualizer */}
              <div className="bg-slate-800 rounded-2xl p-8 min-h-[500px] shadow-inner relative border-4 border-slate-700">
                
                {/* vCenter Layer */}
                {simVCenter && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-purple-100 border-2 border-purple-500 px-6 py-3 rounded-lg flex items-center shadow-lg animate-fade-in z-20">
                    <Monitor className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                      <div className="font-bold text-purple-900">vCenter Server</div>
                      <div className="text-xs text-purple-700">Trạng thái: Quản lý {simHosts.length} Hosts</div>
                    </div>
                  </div>
                )}

                {/* Hosts Layer */}
                <div className="mt-20 flex justify-center gap-8 flex-wrap">
                  {simHosts.length === 0 && (
                    <div className="text-slate-500 flex flex-col items-center mt-20">
                      <Server className="w-16 h-16 mb-4 opacity-50" />
                      <p>Hạ tầng trống. Hãy thêm máy chủ ESXi.</p>
                    </div>
                  )}

                  {simHosts.map((host, idx) => (
                    <div key={host.id} className="relative w-64 bg-slate-50 rounded-xl p-4 border-t-8 border-green-500 shadow-xl animate-slide-up">
                      <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                        <div className="font-bold flex items-center text-slate-700">
                          <Server className="w-5 h-5 mr-2 text-green-600" />
                          ESXi Host {idx + 1}
                        </div>
                        <button onClick={() => removeHost(host.id)} className="text-red-400 hover:text-red-600">
                          <Power className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Connection to vCenter */}
                      {simVCenter && (
                        <div className="absolute -top-[70px] left-1/2 w-0.5 h-[70px] bg-purple-400 opacity-50"></div>
                      )}

                      {/* VMs Area */}
                      <div className="bg-slate-100 rounded-lg p-3 min-h-[120px] mb-4 grid grid-cols-2 gap-2">
                        {host.vms.map((vm: any) => (
                          <div key={vm.id} className="bg-blue-500 border border-blue-600 rounded text-white text-xs font-medium p-2 flex items-center justify-center shadow-sm animate-fade-in">
                            <Monitor className="w-3 h-3 mr-1" /> {vm.name}
                          </div>
                        ))}
                        {host.vms.length === 0 && (
                          <div className="col-span-2 text-xs text-slate-400 text-center mt-8">Chưa có Máy ảo</div>
                        )}
                      </div>

                      <button 
                        onClick={() => addVM(host.id)}
                        className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-semibold rounded transition-colors"
                      >
                        + Tạo Máy ảo (VM)
                      </button>
                      
                      {/* Connection to Storage */}
                      {simStorage && (
                        <div className="absolute -bottom-[80px] left-1/2 w-1 h-[80px] bg-orange-400 opacity-70"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Storage Layer */}
                {simStorage && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 max-w-3xl bg-orange-100 border-2 border-orange-500 p-4 rounded-xl flex items-center justify-center shadow-lg animate-slide-up mt-20">
                    <Database className="w-8 h-8 text-orange-600 mr-4" />
                    <div>
                      <div className="font-bold text-orange-900 text-lg">Shared Datastore (SAN)</div>
                      <div className="text-sm text-orange-700">Dung lượng: {simHosts.reduce((acc, h) => acc + h.vms.length, 0) * 50} GB / 10 TB Đã dùng</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: QUIZ --- */}
        {activeTab === 'quiz' && (
          <div className="h-full flex items-center justify-center bg-slate-100 p-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-2xl w-full">
              {!quizFinished ? (
                <>
                  <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-800">Kiểm tra Kiến thức</h2>
                    <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-medium text-sm">
                      Câu {currentQuestion + 1} / {QUIZ_QUESTIONS.length}
                    </span>
                  </div>

                  <h3 className="text-xl font-medium text-slate-700 mb-6 leading-relaxed">
                    {QUIZ_QUESTIONS[currentQuestion].question}
                  </h3>

                  <div className="space-y-3 mb-8">
                    {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => {
                      let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
                      
                      if (!isAnswerChecked) {
                        buttonClass += "border-slate-200 hover:border-blue-400 hover:bg-blue-50";
                      } else {
                        if (index === QUIZ_QUESTIONS[currentQuestion].answer) {
                          buttonClass += "border-green-500 bg-green-50 text-green-800 font-medium"; // Đúng
                        } else if (index === selectedOption) {
                          buttonClass += "border-red-500 bg-red-50 text-red-800 line-through opacity-70"; // Sai
                        } else {
                          buttonClass += "border-slate-200 opacity-50";
                        }
                      }

                      return (
                        <button
                          key={index}
                          disabled={isAnswerChecked}
                          onClick={() => handleQuizAnswer(index)}
                          className={buttonClass}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswerChecked && (
                    <div className="flex justify-end animate-fade-in">
                      <button 
                        onClick={nextQuestion}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center"
                      >
                        {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'} 
                        <PlayCircle className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <ShieldAlert className="w-12 h-12 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">Hoàn thành bài kiểm tra!</h2>
                  <p className="text-lg text-slate-600 mb-8">
                    Bạn trả lời đúng <span className="font-bold text-blue-600 text-2xl mx-1">{score}</span> trên tổng số {QUIZ_QUESTIONS.length} câu hỏi.
                  </p>
                  <button 
                    onClick={resetQuiz}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium"
                  >
                    Làm lại bài kiểm tra
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Global basic animation styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
      `}} />
    </div>
  );
}
