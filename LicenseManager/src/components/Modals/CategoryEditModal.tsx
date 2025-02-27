import { EditIcon } from '@chakra-ui/icons'
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, Button, Stack, FormLabel, Input,IconButton, FormControl, FormErrorMessage } from '@chakra-ui/react'
import React, { useState } from 'react'
import { type Category, type categoryForm, type RootState, } from '../../types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function CategoryEditModal({ category, onSave }: { category:Category,onSave: (data: categoryForm&{category_id:number}) => void }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isAdmin } = useSelector((state:RootState)=>state.user);

    const [formData, setFormData] = useState<categoryForm>({
        category_name:category.category_name
    });
  
    const handleClick = () =>{
      !isAdmin ? toast.warning("Only Admins can edit") : onOpen();
    }
    const [errors, setErrors] = useState({
        category_name:""
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
          category_name: ""

      }
      let error = false;
      if(!formData["category_name"]){
          newErrors["category_name"] = 'Category is required';
          error = true;
      }

      setErrors(newErrors);
      setTimeout(() => {
          setErrors({
              category_name:""
          })
      },3000)

      if(!error){
          onSave({...formData,category_id:category.category_id});
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
              Edit Category
            </DrawerHeader>
  
            <DrawerBody>
              <Stack spacing='24px'>
                <FormControl isInvalid={!!errors.category_name}>
                    <FormLabel>Category Name</FormLabel>
                    <Input
                    required
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleInputChange}
                    placeholder="Category"
                    />
                    <FormErrorMessage>{errors.category_name}</FormErrorMessage>
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