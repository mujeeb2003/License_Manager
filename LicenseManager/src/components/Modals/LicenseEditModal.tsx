import { EditIcon } from '@chakra-ui/icons'
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, Button, Stack, FormLabel, Input, Select, IconButton, FormControl, FormErrorMessage } from '@chakra-ui/react'
import React, { useState } from 'react'
import { licenseForm, type License, type RootState} from '../../types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function LicenseEditModal({ license, onSave }: { license:License,onSave: (data: licenseForm&{license_id:number}) => void }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {categories,vendors} = useSelector((state:RootState)=>state.license);
  const { isAdmin } = useSelector((state:RootState)=>state.user);

  const handleClick = () =>{
    !isAdmin ? toast.warning("Only Admins can edit licenses") : onOpen();
  }

  const [formData, setFormData] = useState<licenseForm>({
    title: license.title,
    expiry_date: new Date(license.expiry_date),
    "Vendor.vendor_id": vendors.find((vendor)=>vendor.vendor_name === license['Vendor.vendor_name'])?.vendor_id || 0,
    "Category.category_id": categories.find((category)=>category.category_name === license['Category.category_name'])?.category_id || 0,
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
          })
      },3000)

      if(!error){
          onSave({...formData,license_id:license.license_id});
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