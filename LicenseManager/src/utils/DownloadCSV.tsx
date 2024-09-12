import React from 'react';
import type { License} from '../types';
import {Button} from "@chakra-ui/react"

const DownloadCSV = ({ data, fileName }:{data:License[],fileName:string}) => {
    const convertToCSV = (objArray: string | License[]) => {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        
        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (let index in array[i]) {
                if (line !== '') line += ',';
                
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    };
    
    const downloadCSV = () => {
        const header = Object.keys(data[0]).join(',') + '\r\n';
        const csvData = new Blob([header + convertToCSV(data)], { type: 'text/csv' });
        
        // const csvData = new Blob([convertToCSV(data)], { type: 'text/csv' });
        const csvURL = URL.createObjectURL(csvData);
        const link = document.createElement('a');
        link.href = csvURL;
        link.download = `${fileName}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <Button onClick={downloadCSV} colorScheme="blue" mb={4} size={"sm"}>Download CSV</Button>
    );
}

export default DownloadCSV;