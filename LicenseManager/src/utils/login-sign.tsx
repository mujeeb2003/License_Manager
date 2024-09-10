import { useEffect, useState } from "react";

const useLoginToggle = () => {
    const [login, setlogin] = useState<boolean>(true);
    
    const toggleloginmode = () => {
      // console.log("login mode toggle")
      const loginmode = login ? false : true;
      
      setlogin(loginmode);
      // localStorage.setItem('theme', newTheme);
    };
    
    useEffect(() => {
      const logincontainer = document.getElementById("login");
      const signupcontainer = document.getElementById("signup");
      if(logincontainer && signupcontainer) {
        logincontainer.className = login ? "right" : "right hide";
        signupcontainer.className = login ? "right hide" : "right";
      }
    }, [login]);
    
    return [login, toggleloginmode] as const;
  };
  
  export default useLoginToggle;