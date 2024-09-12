import { useLocation } from "react-router-dom";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function getLicense(){
    const query = useQuery();
    if(query.get('title')){
      const titleFilter = query.get('title');
      return titleFilter;
    }
    return "";
}