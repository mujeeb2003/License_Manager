import React from 'react'
import { Box, Container,Text,Tabs,Tab,TabList,TabPanel,TabPanels } from '@chakra-ui/react';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';

function Registration() {
  return <Container  maxW={"xl"} centerContent>
    <Box
      display="flex"
      justifyContent={"center"}
      p={3}
      bg={"white"}
      w={"100%"}
      m={"40px 0 15px 0"}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Text fontSize={"4xl"} fontFamily={"Poppins"} color={"black"}>License Manager</Text>
    </Box>
    <Box bg={"white"} width={"100%"} p={4} borderRadius={"lg"} borderWidth={"1px"}>
      <Tabs variant='soft-rounded'>
        <TabList marginBottom={"1em"}>
          <Tab width={"50%"}>Login</Tab>
          <Tab width={"50%"}>Signup</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Login />
          </TabPanel>
          <TabPanel>
            <Signup />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  </Container> 

  
}

export default Registration