import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../config";
import "./sidebar.css";

export default function Sidebar() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const getCategories = async () => {
            const res = await axiosInstance.get("/categories");
            setCategories(res.data);
        };

        getCategories();
    }, []);

    return (
        <div className="sidebar">
            <div className="sidebarItem">
                <span className="sidebarTitle">ABOUT ME</span>
                <img 
                    src="https://images.pexels.com/photos/2345293/pexels-photo-2345293.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" 
                    alt="" 
                />
                <p>
                    You are the dancing queen. Young and sweet, only seventeen. Dancing queen. Feel the beat from the tambourine, oh yeah. You can dance, you can jive. Having the time of your life. Ooh, see that girl, watch that scene. Digging the dancing queen.
                </p>
            </div>
            <div className="sidebarItem">
                <span className="sidebarTitle">CATEGORY</span>
                <ul className="sidebarList">
                    {categories.map(category => (
                        <Link to={`/?cat=${category.name}`} className="link" key={category._id}>
                            <li className="sidebarListItem">{category.name.toUpperCase()}</li>
                        </Link>
                    ))}                    
                </ul>
            </div>
            <div className="sidebarItem">
                <span className="sidebarTitle">FOLLOW US</span>
                <div className="sidebarSocial">
                    <i className="sidebarIcon fab fa-facebook-square"></i>
                    <i className="sidebarIcon fab fa-twitter-square"></i>
                    <i className="sidebarIcon fab fa-instagram-square"></i>
                    <i className="sidebarIcon fab fa-pinterest-square"></i>
                </div>
            </div>
        </div>
    )
}
