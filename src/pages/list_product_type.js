import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Products from "../components/products";
import Header from "../components/header";
import ListBanner from "./list_banner";
import Footer from "../components/footer";


function ListProductType()
{
    const [loaiSanPham,setLoaiSanPham]=useState([]);
    let {lspID}=useParams();
    useEffect(()=>{
        async function getDatFromAPI()
        {       
            try{
                var response= await axios.get(`http://localhost:8000/api/loai-san-pham/${lspID}`);
                setLoaiSanPham(response.data.data);
                }catch(error){
                    console.error('Error:'+error.message);
                }
        }
        getDatFromAPI();
    },[]);
    const LoaiSanPhamUI=()=>{
        if(loaiSanPham && Object.keys(loaiSanPham).length > 0)
            return <Products member={loaiSanPham}/>
        return <></>
    }
    return (
    <>
    <Header/>
    <ListBanner/>
    {
        LoaiSanPhamUI()
    }
    <Footer/>     
    </>
    )
}
export default ListProductType;