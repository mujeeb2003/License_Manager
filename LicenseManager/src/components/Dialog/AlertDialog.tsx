import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, IconButton, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { AppDispatch, DialogProps, type RootState } from "../../types"
import { DeleteIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, deleteDomain, deleteLicense, deleteVendor } from "../../redux/license/licenseSlice";
import { toast } from "react-toastify";

export default function AlertDialogS({license_id,vendor_id,category_id,domain_id, isRound}:DialogProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isSuperAdmin } = useSelector((state:RootState)=>state.user);
    const cancelRef = React.useRef<HTMLButtonElement>(null);
    const dispatch = useDispatch<AppDispatch>();
 
    const handleClick = () =>{
        !isSuperAdmin ? toast.warning("Only Power Admins can delete") : onOpen();
    }
    const handleDelete = () =>{
      if(category_id){
        dispatch(deleteCategory({category_id:category_id})).then((res)=>{
            if(res.payload.message){
                return toast.success(res.payload.message);
            }
            if(res.payload.error){
              return toast.error(res.payload.error);
            }
        })
      }
      if(license_id){
        dispatch(deleteLicense({license_id:license_id})).then((res)=>{
          if(res.payload.message){
            return toast.success(res.payload.message);
          }
          if(res.payload.error){
            return toast.error(res.payload.error);
          }
        })
      }
      if(vendor_id){
        dispatch(deleteVendor({vendor_id:vendor_id})).then((res)=>{
            if(res.payload.message){
                return toast.success(res.payload.message);
            }
            if(res.payload.error){
              return toast.error(res.payload.error);
            }
        })
      }
      if(domain_id){
        dispatch(deleteDomain({domain_id:domain_id})).then((res)=>{
            if(res.payload.message){
                return toast.success(res.payload.message);
            }
            if(res.payload.error){
              return toast.error(res.payload.error);
            }
        })
      }
      onClose();
    }

    return (
      <>
        <IconButton
            mr={2}
            isRound = {isRound ? false : true}
            size={isRound ? "sm" : "md"}
            variant="solid"
            colorScheme="red"
            icon={<DeleteIcon />}
            aria-label="Delete"
            onClick={handleClick}
        />
  
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete {license_id ? "license" : category_id ? "category" : vendor_id ? "vendor" : domain_id ? "domain" : ""}
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