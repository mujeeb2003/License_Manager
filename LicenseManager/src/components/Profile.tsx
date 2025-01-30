import React, { useState } from "react";
import { Box, Button, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Flex, Text, Input, VStack, HStack, useDisclosure, Avatar, SimpleGrid, useColorModeValue, IconButton, chakra } from "@chakra-ui/react";
import { motion, AnimatePresence, isValidMotionProp } from "framer-motion";
import { RootState, type AppDispatch } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { EditIcon, EmailIcon, CalendarIcon, StarIcon, LockIcon } from "@chakra-ui/icons";
import { updateUser } from "../redux/user/userSlice";

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
});

interface ProfileCardProps {
  icon: React.ReactElement;
  title: string;
  value: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ icon, title, value }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.200");

  return (
    <ChakraBox
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="md"
      display="flex"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
    >
      <Box fontSize="3xl" mb={2}>
        {icon}
      </Box>
      <Text fontWeight="bold" mb={1}>
        {title}
      </Text>
      <Text color={textColor}>{value}</Text>
    </ChakraBox>
  );
};

// interface User {
//   username: string;
//   email: string;
//   isAdmin: boolean;
//   isDisable: boolean;
// }

interface EditForm {
  username: string;
  password: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [lastLogin] = useState<Date>(new Date());
  const [editForm, setEditForm] = useState<EditForm>({ username: "", password: "" });

  const bgColor = useColorModeValue("gray.50", "gray.900");

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    // Handle save logic here
    console.log("Username: ", editForm.username);
    console.log("Password: ", editForm.password);
    dispatch(updateUser({ user_id: user.user_id, username: editForm.username, password: editForm.password }));
    onClose();
  };

  return (
    <Box p={8} maxW="1200px" mx="auto" bg={bgColor} minH="100vh">
      <AnimatePresence>
        <ChakraBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 } as any}
        >
          <Flex justifyContent="space-between" alignItems="center" mb={8}>
            <VStack align="start">
              <Text fontSize="3xl" fontWeight="bold">
                My Profile
              </Text>
              <Text fontSize="md" color="gray.500">
                Manage your account settings and personal information
              </Text>
            </VStack>
            <HStack>
              <Avatar size="lg" name={user.username} src="https://bit.ly/broken-link" />
              <IconButton
                aria-label="Edit Profile"
                icon={<EditIcon />}
                onClick={onOpen}
                colorScheme="blue"
                variant="outline"
              />
            </HStack>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            <ProfileCard icon={<EditIcon />} title="Username" value={user.username} />
            <ProfileCard icon={<EmailIcon />} title="Email" value={user.email} />
            <ProfileCard icon={<StarIcon />} title="Role" value={user.isAdmin ? "Admin" : "User"} />
            <ProfileCard icon={<LockIcon />} title="Status" value={user.isDisable ? "Disabled" : "Active"} />
            <ProfileCard icon={<CalendarIcon />} title="Last Login" value={lastLogin.toLocaleString()} />
          </SimpleGrid>
        </ChakraBox>
      </AnimatePresence>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Profile</DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="start">
              <Box w="full">
                <Text mb={1}>Username</Text>
                <Input
                  name="username"
                  value={editForm.username}
                  onChange={handleEditFormChange}
                  placeholder="Enter new username"
                />
              </Box>
                <Box w="full">
                <Text mb={1}>Password</Text>
                <Input
                  name="password"
                  type="password"
                  value={editForm.password}
                  onChange={handleEditFormChange}
                  placeholder="Enter new password"
                  minLength={8}
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
              onClick={handleSaveChanges}
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