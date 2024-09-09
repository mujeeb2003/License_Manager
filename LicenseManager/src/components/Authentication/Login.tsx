import React,{useState} from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'

function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [show, setshow] = useState(false);

  const [guestcredentials, setguestcredentials] = useState({
    email:'guest@gmail.com',
    password:'123456'
  });

  const handleshow  = () => {
    setshow(!show);
  }
  const submitHandler = () => {

  }
  return <VStack spacing={"5px"}>
  
  <FormControl id='email' isRequired>
    <FormLabel>Email</FormLabel>
    <Input placeholder='Enter your email' type='email' onChange={(e)=>setemail(e.target.value)} value={email}>
    </Input>
  </FormControl>

  <FormControl id='password' isRequired>
    <FormLabel>Password</FormLabel>
    <InputGroup>
      <Input placeholder='Enter your password' type={show?"text":"password"} onChange={(e)=>setpassword(e.target.value)} value={password}>
      </Input>
      <InputRightElement width={"4.5rem"}>
        <Button h="1.75rem" size={"sm"} onClick={handleshow}>
          {show ? "Hide":"Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  </FormControl>

  <Button colorScheme='blue' width={"100%"} style={{marginTop:"15px"}} onClick={submitHandler}>Login</Button>

  <Button variant={"solid"} colorScheme='red' width={"100%"} style={{marginTop:"15px"}} onClick={()=>{setemail(guestcredentials.email);setpassword(guestcredentials.password)}}>Get Credentails</Button>

</VStack>
}

export default Login