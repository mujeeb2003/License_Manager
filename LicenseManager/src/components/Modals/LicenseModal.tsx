import {Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,Input,FormControl,FormLabel,Button,useDisclosure, Select,FormErrorMessage, Icon} from '@chakra-ui/react';
import { useState } from 'react';
import { type licenseForm, type RootState } from '../../types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AddIcon } from '@chakra-ui/icons';

function LicenseModal({ onSave }: { onSave: (data: licenseForm) => void }) {
    const {categories,vendors} = useSelector((state:RootState)=>state.license);
    const { isOpen,onOpen, onClose } = useDisclosure();
    const { isAdmin } = useSelector((state:RootState)=>state.user);

    const handleClick = () =>{
      !isAdmin ? toast.warning("Only Admins can add licenses") : onOpen();
    }
    
    const [formData, setFormData] = useState<licenseForm>({
        title: '',
        expiry_date: null,
        "Vendor.vendor_id": 0,
        "Category.category_id": 0,
    });
    
    const [errors, setErrors] = useState({
        title: '',
        expiry_date: '',
        "Vendor.vendor_id": '',
        "Category.category_id": '',
    });
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        
        setErrors((prev) => ({
            ...prev,
            [name]: ''
        }));
    };
    
    const handleSubmit = () => {
        const newErrors = {
            title: '',
            expiry_date: '',
            "Vendor.vendor_id": '',
            "Category.category_id": '',
            "Status.status_id": ''
        }
        let error = false;
        if(!formData.title){
            newErrors.title = 'Title is required';
            error = true;
        }
        if(!formData.expiry_date){
            newErrors.expiry_date = 'Expiry Date is required';
            error = true;
        }
        if(!formData["Vendor.vendor_id"]){
            newErrors["Vendor.vendor_id"] = 'Vendor is required';
            error = true;
        }
        if(!formData["Category.category_id"]){
            newErrors["Category.category_id"] = 'Category is required';
            error = true;
        }

        setErrors(newErrors);
        setTimeout(() => {
            setErrors({
                title: '',
                expiry_date: '',
                "Vendor.vendor_id": '',
                "Category.category_id": '',
                // "Status.status_id": ''
            })
        },3000)

        if(!error){
            onSave(formData);
            onClose(); // Close the modal after saving
        }
    };
    
    return (
        <>
        <Button onClick={handleClick} colorScheme="blue" mb={4} size={"sm"}>
            <Icon mr={2} as={AddIcon}/>
            Add New License
        </Button>
        
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
            <ModalContent width={'1000px'}>
                <ModalHeader>Add New License</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isInvalid={!!errors.title}>
                        <FormLabel>Title</FormLabel>
                        <Input
                        required
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Title"
                        />
                        <FormErrorMessage>{errors.title}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={!!errors.expiry_date} mt={4}>
                        <FormLabel>Expiry Date</FormLabel>
                        <Input
                        required
                        name="expiry_date"
                        onChange={handleInputChange}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        />
                        <FormErrorMessage>{errors.expiry_date}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={!!errors["Vendor.vendor_id"]} mt={4}>
                        <FormLabel>Vendor</FormLabel>
                        <Select
                        required
                        name="Vendor.vendor_id"
                        value={formData["Vendor.vendor_id"]}
                        onChange={handleInputChange}
                        placeholder="Vendor"
                        >
                            {vendors.map((vendor) => (
                                <option key={vendor.vendor_id} value={vendor.vendor_id}>
                                    {vendor.vendor_name}
                                </option>
                            ))}
                        </Select>
                        <FormErrorMessage>{errors["Vendor.vendor_id"]}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={!!errors["Category.category_id"]} mt={4}>
                        <FormLabel>Category</FormLabel>
                        <Select
                        required
                        name="Category.category_id"
                        value={formData["Category.category_id"]}
                        onChange={handleInputChange}
                        placeholder="Category"
                        >
                            {categories.map((category) => (
                                <option key={category.category_id} value={category.category_id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </Select>
                        <FormErrorMessage>{errors["Category.category_id"]}</FormErrorMessage>
                    </FormControl>
                </ModalBody>
                
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    );
}

export default LicenseModal;
