import React, { useState, useRef } from 'react';
import StudentSidebar from './Sidebar';
import logo from '../../assets/logo.png';
import { FaPlus, FaMicrophone, FaPaperPlane } from 'react-icons/fa';

// Message type supports text and file/image
interface Message {
  role: 'user' | 'assistant';
  text?: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
}

const AiAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);

  // Handle sending text message
  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: 'user', text: input }]);
      setInput('');
      // Simulate assistant response (replace with real logic as needed)
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          { role: 'assistant', text: 'CA stands for Computer Analyst, a professional who repairs computer hardware and manages...' }
        ]);
      }, 500);
    }
  };

  // Handle file/image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setMessages([
        ...messages,
        {
          role: 'user',
          fileUrl,
          fileType: file.type,
          fileName: file.name,
        },
      ]);
      // Optionally, simulate assistant response for file upload
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          { role: 'assistant', text: 'File received: ' + file.name },
        ]);
      }, 500);
    }
    // Reset input so same file can be uploaded again if needed
    e.target.value = '';
  };

  // Trigger file input when + button is clicked
  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  // Handle voice recognition
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    let SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
        setListening(false);
      };
      recognitionRef.current.onerror = () => setListening(false);
      recognitionRef.current.onend = () => setListening(false);
    }
    setListening(true);
    recognitionRef.current.start();
  };

  return (
    <div className="flex h-screen bg-[#f7f9fc]">
      {/* Sidebar */}
      <StudentSidebar />
      {/* Main Content */}
      <div className="flex-1 ml-60 flex flex-col relative">
        {/* Header */}
        <div className="flex justify-end items-center h-20 px-10 border-b border-gray-200 bg-transparent">
          <img src={logo} alt="FOCAS Logo" className="h-10 w-auto" />
        </div>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-3xl flex flex-col items-center justify-center h-full">
            <div className="text-[#120088] text-lg font-medium mb-8 mt-10 text-center">What can I help you with?</div>
            {/* Messages */}
            <div className="w-full flex flex-col gap-4 items-start mb-8">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`rounded-full px-4 py-2 text-sm max-w-[80%] break-words ${
                    msg.role === 'assistant'
                      ? 'bg-white text-[#120088] border border-[#120088] self-start'
                      : 'bg-[#120088] text-white self-end'
                  }`}
                >
                  {msg.text && <span>{msg.text}</span>}
                  {msg.fileUrl && (
                    <span>
                      {msg.fileType?.startsWith('image') ? (
                        <img src={msg.fileUrl} alt={msg.fileName} className="max-w-[200px] max-h-[120px] rounded-lg mt-2" />
                      ) : (
                        <a href={msg.fileUrl} download={msg.fileName} className="underline mt-2 block">{msg.fileName}</a>
                      )}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {/* Input Area */}
            <div className="w-full flex items-center gap-2 mt-auto mb-10">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,application/pdf,.doc,.docx,.ppt,.pptx,.txt,.csv,.xlsx,.xls,.zip,.rar,.mp3,.mp4,.wav,.avi,.mov,.json,.xml,.html,.js,.ts,.tsx,.py,.java,.c,.cpp,.h,.hpp,.php,.rb,.go,.sh,.md,.svg,.webp,.gif,.bmp,.tiff,.ico,.heic,.webm,.ogg,.mkv,.flac,.aac,.m4a,.wav,.mpg,.mpeg,.3gp,.3g2,.asf,.wmv,.midi,.mid,.rtf,.odt,.ods,.odp,.odg,.odf,.pages,.numbers,.key,.apk,.exe,.msi,.dmg,.iso,.bin,.bat,.cmd,.com,.dll,.sys,.tmp,.torrent,.log,.dat,.bak,.cfg,.ini,.plist,.reg,.scr,.srt,.vtt,.yml,.yaml,.toml,.lock,.env,.crt,.pem,.cer,.key,.csr,.pfx,.p12,.der,.jks,.keystore,.asc,.gpg,.sig,.pub,.ppk,.ssh,.jsonl,.parquet,.feather,.arrow,.orc,.avro,.hdf5,.h5,.mat,.npz,.pkl,.sav,.rda,.rds,.sas7bdat,.dta,.por,.arff,.csv.gz,.tsv,.tsv.gz,.xls.gz,.xlsx.gz,.ods.gz,.db,.sqlite,.sqlite3,.dbf,.mdb,.accdb,.sql,.bak,.dump,.tar,.gz,.bz2,.xz,.lz,.lzma,.z,.7z,.cab,.cpio,.jar,.war,.ear,.sar,.mar,.rar,.zipx,.zst,.lz4,.s7z,.ace,.alz,.arc,.arj,.bz,.bza,.cbr,.cbz,.gz,.hqx,.ipa,.isz,.lzh,.lzma,.pak,.part,.pkg,.rar,.sit,.sitx,.tar.bz2,.tar.gz,.tgz,.tlz,.txz,.uue,.z,.zip,.zipx"
                onChange={handleFileChange}
              />
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#120088] text-white text-lg focus:outline-none"
                onClick={handlePlusClick}
                aria-label="Upload File or Image"
                type="button"
              >
                <FaPlus />
              </button>
              <input
                type="text"
                className="flex-1 border border-[#120088] rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#120088] bg-transparent"
                placeholder="Ask Anything"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && input.trim()) handleSend(); }}
              />
              <button
                className={`flex items-center justify-center w-8 h-8 rounded-full border border-[#120088] text-[#120088] text-lg ml-2 focus:outline-none ${listening ? 'animate-pulse bg-blue-100' : ''}`}
                aria-label="Voice Input"
                type="button"
                onClick={handleMicClick}
              >
                <FaMicrophone />
              </button>
              <button
                className={`flex items-center justify-center w-8 h-8 rounded-full bg-[#120088] text-white text-lg ml-2 focus:outline-none transition-opacity ${input.trim() ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                aria-label="Send"
                type="button"
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant; 