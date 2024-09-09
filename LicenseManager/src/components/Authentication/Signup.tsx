import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React,{useState} from 'react'

function Signup() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [pic, setpic] = useState("");
  const [show, setshow] = useState(false);

  const handleshow = ()=>{
    setshow(!show);
  }

  const postDetails = (pics) => {

  }
  
  const submitHandler = () => {

  }
  
  return <VStack spacing={"5px"}>
    
    <FormControl id='first-name' isRequired>
      <FormLabel>First Name</FormLabel>
      <Input placeholder='Enter your name' onChange={(e)=>setname(e.target.value)}>
      </Input>
    </FormControl>
    
    <FormControl id='email' isRequired>
      <FormLabel>Email</FormLabel>
      <Input placeholder='Enter your email' type='email' onChange={(e)=>setemail(e.target.value)}>
      </Input>
    </FormControl>

    <FormControl id='password' isRequired>
      <FormLabel>Password</FormLabel>
      <InputGroup>
        <Input placeholder='Enter your password' type={show?"text":"password"} onChange={(e)=>setpassword(e.target.value)}>
        </Input>
        <InputRightElement width={"4.5rem"}>
          <Button h="1.75rem" size={"sm"} onClick={handleshow}>
            {show ? "Hide":"Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>

    <FormControl id='confirmpassword' isRequired>
      <FormLabel>Confirm Password</FormLabel>
      <InputGroup>
        <Input placeholder='Enter your password again' type={show?"text":"password"} onChange={(e)=>setconfirmPassword(e.target.value)}>
        </Input>
        <InputRightElement width={"4.5rem"}>
          <Button h="1.75rem" size={"sm"} onClick={handleshow}>
            {show ? "Hide":"Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  
    <FormControl id='pic' isRequired>
      <FormLabel>Upload your picture</FormLabel>
      <Input placeholder='Select a picture' type='file' accept='image/*' p={1.5} 
        onChange={(e)=>postDetails(e.target.files[0])}
        >
      </Input>
    </FormControl>

    <Button colorScheme='blue' width={"100%"} style={{marginTop:"15px"}} onClick={submitHandler}>Sign Up</Button>
  </VStack>
}

export default Signup