import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, IconButton, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { AppDispatch, DialogProps } from "../../types"
import { DeleteIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { deleteCategory, deleteLicense, deleteVendor } from "../../redux/license/licenseSlice";
import { toast } from "react-toastify";

export default function AlertDialogS({license_id,vendor_id,category_id}:DialogProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef<HTMLButtonElement>(null);
    const dispatch = useDispatch<AppDispatch>();
 
    const handleDelete = () =>{
      if(category_id){
        dispatch(deleteCategory({category_id:category_id})).then((res)=>{
            if(res.payload.message){
                toast.success(res.payload.message);
            }
        })
      }
      if(license_id){
        dispatch(deleteLicense({license_id:license_id})).then((res)=>{
            if(res.payload.message){
                toast.success(res.payload.message);
            }
        })
      }
      if(vendor_id){
        dispatch(deleteVendor({vendor_id:vendor_id})).then((res)=>{
            if(res.payload.message){
                toast.success(res.payload.message);
            }
        })
      }
      onClose();
    }
    return (
      <>
        <IconButton
            mr={2}
            isRound
            variant="solid"
            colorScheme="red"
            icon={<DeleteIcon />}
            aria-label="Delete"
            onClick={onOpen}
            //     onClick={()=>dispatch(deleteCategory({category_id:row.category_id})).then((res)=>{
            //     if(res.payload.message){
            //         toast.success(res.payload.message);
            //     }
            // })
            // }
        />
  
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete {license_id ? "license" : category_id ? "category" : vendor_id ? "vendor" : ""}
              </AlertDialogHeader>
  
              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme='red' onClick={()=>handleDelete()} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }