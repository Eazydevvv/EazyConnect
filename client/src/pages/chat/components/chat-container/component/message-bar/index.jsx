import { useAppStore } from "@/store"
import EmojiPicker from "emoji-picker-react"
import { useEffect, useRef, useState } from "react"
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from "react-icons/io5"
import { RiEmojiStickerLine } from "react-icons/ri"
import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client"
import { UPLOAD_FILE_ROUTES } from "@/utils/constant"

const MessageBar = () => {
    const emojiRef = useRef();
    const fileInputRef = useRef();
    const socket = useSocket();
    const { selectedChatType, selectedChatData, userInfo , setIsUploading , setFileUploadProgress, } = useAppStore()
    const [message, setMessage] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const messageSendSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-message-pop-alert-2354.mp3");

    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [emojiRef])

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji)
    }
    const handleSendMessage = async () => {
        if (!message.trim()) return;
        
        if (selectedChatType === "contact") {
          socket.emit("sendMessage", {
            sender: userInfo.id,
            content: message,
            recipient: selectedChatData._id,
            messageType: "text",
            fileUrl: undefined
          });
      
          const messageSendSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-message-pop-alert-2354.mp3");
          messageSendSound.play();
      
          setMessage("");
        }
      };
      
      

    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleAttachmentChange = async (event) => {
        try {
            const file = event.target.files[0];
            if(file){
                const formData = new FormData();
                formData.append("file", file);
                setIsUploading(true);
                const response = await apiClient.post(UPLOAD_FILE_ROUTES, formData,{
                    withCredentials:true,
                    onUploadProgress:data=>{
                        setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
                    }
                }

                );
                if(response.status===200 && response.data) {
                    setIsUploading(false)
                    if (selectedChatType === "contact"){
                    socket.emit("sendMessage", {
                        sender: userInfo.id,
                        content: undefined,
                        recipient: selectedChatData._id,
                        messageType: "file",
                        fileUrl: response.data.filePath
                    })
                }
                }
            }
            console.log({ file });
        } catch (error) {
            setIsUploading(false)
            console.log({ error });
        }
    }

    return (
        <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-4 sm:px-6 md:px-8 mb-4 md:mb-6 gap-4 md:gap-6">
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-3 sm:gap-4 md:gap-5 pr-3 md:pr-5">
                <input
                    type="text"
                    className="flex-1 p-3 md:p-5 bg-transparent rounded-md focus:border-none focus:outline-none text-sm md:text-base"
                    placeholder="Enter Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                    onClick={handleAttachmentClick}
                >
                    <GrAttachment className="text-xl md:text-2xl" />
                </button>
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
                <div className="relative">
                    <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={() => setEmojiPickerOpen(true)}>
                        <RiEmojiStickerLine className="text-xl md:text-2xl" />
                    </button>
                    {emojiPickerOpen && (
                        <div className="absolute bottom-14 md:bottom-16 right-0" ref={emojiRef}>
                            <EmojiPicker
                                theme="dark"
                                open={emojiPickerOpen}
                                onEmojiClick={handleAddEmoji}
                                autoFocusSearch={false}
                            />
                        </div>
                    )}
                </div>
            </div>
            <button className="bg-[#8417ff] rounded-md flex items-center justify-center p-3 md:p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all" onClick={handleSendMessage}>
                <IoSend className="text-xl md:text-2xl" />
            </button>
        </div>
    )
}

export default MessageBar;


