import React, { useState } from "react";
import { Box, Button, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Flex, Text, Input, VStack, HStack, useDisclosure,
} from "@chakra-ui/react";
import { RootState } from "../types";
import { useSelector } from "react-redux";
;
const ProfilePage = () => {
  const { user } = useSelector((state:RootState)=>state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [lastLogin, setLastLogin] = useState((new Date()));  // default value
  const [editform, seteditform] = useState({username:"",password:""});


  return (
    <Box p={8} maxW="900px" mx="auto">
      {/* Profile Header */}
      <Flex justifyContent="space-between" mb={8}>
        <VStack align="start">
          <Text fontSize="2xl" fontWeight="bold">
            My Profile
          </Text>
          <Text fontSize="md" color="gray.500">
            Manage your account settings and personal information
          </Text>
        </VStack>
        <Button colorScheme="blue" onClick={onOpen}>
          Edit Profile
        </Button>
      </Flex>

      {/* User Information Display */}
      <Box
        p={6}
        bg="white"
        shadow="md"
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
      >
        <VStack spacing={4} align="start">
          <HStack>
            <Text fontWeight="bold">Username:</Text>
            <Text>{user.username}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold">Email:</Text>
            <Text>{user.email}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold">Role:</Text>
            <Text>{user.isAdmin ? "Admin" : "User"}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold">Status:</Text>
            <Text>{user.isDisable ? "Disabled": "Active"}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold">Last Login:</Text>
            <Text>{lastLogin.toString()}</Text>
          </HStack>
        </VStack>
      </Box>

      {/* Edit Profile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Profile</DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="start">
              <Box w="full">
                <Text mb={1}>Username</Text>
                <Input
                  value={editform.username}
                  onChange={(e) => seteditform({...editform,username:e.target.value})}
                  placeholder="Enter new username"
                />
              </Box>
              <Box w="full">
                <Text mb={1}>Password</Text>
                <Input
                  type="password"
                  value={editform.password}
                  onChange={(e) => seteditform({...editform,password:e.target.value})}
                  placeholder="Enter new password"
                />
              </Box>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                // Handle save logic here
                console.log("Username: ", editform.username);
                console.log("Password: ", editform.password);
                onClose();
              }}
            >
              Save Changes
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default ProfilePage;
