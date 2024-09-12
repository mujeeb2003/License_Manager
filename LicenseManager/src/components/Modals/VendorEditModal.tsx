import { EditIcon } from '@chakra-ui/icons'
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, Button, Stack, FormLabel, Input, Select, IconButton, FormControl, FormErrorMessage } from '@chakra-ui/react'
import React, { useState } from 'react'
import { vendorForm, type Vendor, type RootState} from '../../types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function VendorEditModal({ vendor, onSave }: { vendor:Vendor,onSave: (data: vendorForm&{vendor_id:number}) => void }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isAdmin } = useSelector((state:RootState)=>state.user);

    const handleClick = () =>{
      !isAdmin ? toast.warning("Only Admins can edit Vendor details") : onOpen();
    }

    const [formData, setFormData] = useState<vendorForm>({
        vendor_name:vendor.vendor_name,
        vendor_email:vendor.vendor_email,
        vendor_rep_email:vendor.vendor_rep_email,
        vendor_rep_phone:vendor.vendor_rep_phone,
        vendor_representative:vendor.vendor_representative
    });
    
    const [errors, setErrors] = useState<vendorForm>({
        vendor_name:"",
        vendor_email:"",
        vendor_rep_email:"",
        vendor_rep_phone:"",
        vendor_representative:""
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
            vendor_name: "",
            vendor_email:"",
            vendor_rep_email:"",
            vendor_rep_phone:"",
            vendor_representative:""

        }
        let error = false;
        if(!formData["vendor_name"]){
            newErrors["vendor_name"] = 'Vendor is required';
            error = true;
        }
        if(!formData["vendor_email"]){
            newErrors["vendor_email"] = 'Vendor Email is required';
            error = true;
        }
        if(!formData["vendor_representative"]){
            newErrors["vendor_representative"] = 'Vendor Representative is required';
            error = true;
        }
        if(!formData["vendor_rep_email"]){
            newErrors["vendor_rep_email"] = 'Vendor Representative Email is required';
            error = true;
        }
        if(!formData["vendor_rep_phone"]){
            newErrors["vendor_rep_phone"] = 'Vendor Representative Phone is required';
            error = true;
        }

        setErrors(newErrors);
        setTimeout(() => {
            setErrors({
                vendor_name:"",
                vendor_email:"",
                vendor_rep_email:"",
                vendor_rep_phone:"",
                vendor_representative:""
            })
        },3000)

        if(!error){
            onSave({...formData,vendor_id:vendor.vendor_id});
            onClose(); // Close the modal after saving
        }
    };
  
    return (
      <>
        <IconButton
          isRound
          variant="solid"
          colorScheme="blue"
          icon={<EditIcon />}
          aria-label="Edit"
          onClick={handleClick}
        />

        <Drawer
          isOpen={isOpen}
          placement='right'
          onClose={onClose}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>
              Edit License
            </DrawerHeader>
  
            <DrawerBody>
              <Stack spacing='24px'>
                <FormControl isInvalid={!!errors.vendor_name}>
                        <FormLabel>Vendor Name</FormLabel>
                        <Input
                        required
                        name="vendor_name"
                        value={formData.vendor_name}
                        onChange={handleInputChange}
                        placeholder="Vendor"
                        />
                        <FormErrorMessage>{errors.vendor_name}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.vendor_email} mt={4}>
                    <FormLabel>Vendor Email</FormLabel>
                    <Input
                    required
                    name="vendor_email"
                    value={formData.vendor_email}
                    onChange={handleInputChange}
                    placeholder="Vendor"
                    />
                    <FormErrorMessage>{errors.vendor_email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.vendor_representative} mt={4}>
                    <FormLabel>Vendor Representative</FormLabel>
                    <Input
                    required
                    name="vendor_representative"
                    value={formData.vendor_representative}
                    onChange={handleInputChange}
                    placeholder="Vendor"
                    />
                    <FormErrorMessage>{errors.vendor_representative}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.vendor_rep_email} mt={4}>
                    <FormLabel>Vendor Representative Email</FormLabel>
                    <Input
                    required
                    name="vendor_rep_email"
                    value={formData.vendor_rep_email}
                    onChange={handleInputChange}
                    placeholder="Vendor"
                    type='email'
                    />
                    <FormErrorMessage>{errors.vendor_rep_email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.vendor_rep_phone} mt={4}>
                    <FormLabel>Vendor Representative Phone</FormLabel>
                    <Input
                    required
                    name="vendor_rep_phone"
                    value={formData.vendor_rep_phone}
                    onChange={handleInputChange}
                    placeholder="Vendor"
                    type='number'
                    />
                    <FormErrorMessage>{errors.vendor_rep_phone}</FormErrorMessage>
                </FormControl>
              </Stack>
            </DrawerBody>
  
            <DrawerFooter borderTopWidth='1px'>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='blue' onClick={handleSubmit}>Submit</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  }