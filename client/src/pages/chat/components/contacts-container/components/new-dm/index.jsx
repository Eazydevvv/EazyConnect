import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { animationDefaultOptions, getColor } from "@/lib/utils"
import Lottie from "react-lottie"
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constant"
import { apiClient } from "@/lib/api-client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { useAppStore } from "@/store"
const NewDM = () => {
    const {setSelectedChatData, setSelectedChatType} = useAppStore();
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([])

    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const response = await apiClient.post(
                    SEARCH_CONTACTS_ROUTES,
                    { searchTerm },
                    { withCredentials: true }
                );
                if (response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts)
                }
            } else {
                setSearchedContacts([])
            }

        } catch (error) {
            console.log({ error });
        }
    }


    const selectNewContact = (contact)=>{
       setOpenNewContactModal(false);
       setSelectedChatType("contact");
       setSelectedChatData(contact);
       setSearchedContacts([]);
    }
    return (
        <div>
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus
                        className="text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300"
                        onClick={() => setOpenNewContactModal(true)}
                    />
                </TooltipTrigger>
                <TooltipContent
                    className="bg-[#1c1b1e] bordr-none mb-2 p-3 text-white">
                    Select New Contact
                </TooltipContent>
            </Tooltip>
            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please select a contact</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Search Contacts"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={(e) => searchContacts(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="h-250px">
                        <div className="flex flex-col gap-5">
                            {
                                searchedContacts.map((contact) => (
                                    <div key={contact._id} className="flex gap-3 items-center cursor-pointer" onClick={()=>selectNewContact (contact)}>
                                        <div className="w-12 h-12 relative">
                                            <Avatar className=" h-12 w-12  rounded-full overflow-hidden">
                                                {
                                                    contact.image ? (<AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className={"object-cover w-full h-full bg-black rounded-full"} />) : (
                                                        <div className={` uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                                            {contact.firstName ?
                                                                contact.firstName.split("").shift() :
                                                                contact.email.split("").shift()}

                                                        </div>


                                                    )}
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                           <span>
                                           {
                                                contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email
                                            }
                                           </span>
                                           <span className="text-xs">
                                            {contact.email}
                                           </span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </ScrollArea>
                    <div className="flex-1 relative overflow-y-auto"> {/* Added relative and overflow */}
                        {searchedContacts.length <= 0 && (
                            <div className="absolute inset-0 md:bg-[#1c1d25] flex flex-col justify-center items-center">
                                <Lottie
                                    isClickToPauseDisabled
                                    height={100}
                                    width={100}
                                    options={animationDefaultOptions}
                                />
                                <div className="text-opacity-80 text-white flex flex-col gap-10 items-center mt-5 lg:text-2xl text-xl">
                                    <h3 className="poppins-medium">
                                        Hi<span className="text-purple-500">! </span>
                                        Search new
                                        <span className="text-purple-500"> Contact.</span>
                                    </h3>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default NewDM 