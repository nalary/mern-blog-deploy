import { useContext, useRef, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Context } from "../../context/Context";
import "./settings.css";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";
import { updateCall } from "../../apiCalls";
import { axiosInstance } from "../../config";

export default function Settings() {
    const { user, dispatch } = useContext(Context);

    // const [username, setUsername] = useState("");
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [file, setFile] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/users/${user._id}`, {
                data: {userId : user._id}
            });
            dispatch({ type: "LOGOUT" });
            window.location.replace("/");
        } catch (err) {
            console.log(err);
        }     
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const updatedUser = {
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            userId: user._id         
        };

        if (file) {
            const fileName = file.name + "_" + Date.now();
            const storage = getStorage(app);
            const storageRef = ref(storage, `blog/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', 
                (snapshot) => {                    
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                    }
                }, 
                (error) => {
                    console.log(error);
                }, 
                () => {                    
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {                    
                        updatedUser.profilePic= downloadURL;
                        updateCall(updatedUser, user._id, dispatch);
                        setSuccess(true);
                    });
                }
            );
            
        } else {
            updateCall(updatedUser, user._id, dispatch);
            setSuccess(true);
        }    
    };

    return (
        <div className="settings">
            <div className="settingsWrapper">
                <div className="settingsTitle">
                    <span className="settingsUpdateTitle">Update Your Account</span>
                    <span className="settingsDeleteTitle" onClick={handleDelete}>Delete Account</span>
                </div>
                <form className="settingsForm" onSubmit={handleSubmit}>
                    <label>Profile Picture</label>
                    <div className="settingsPP">
                        <img                             
                            src={file ? URL.createObjectURL(file) : user.profilePic ? user.profilePic : "https://firebasestorage.googleapis.com/v0/b/mern-blog-4c8dc.appspot.com/o/blog%2FnoAavatar.png?alt=media&token=f2988122-a6f9-4cf3-95a1-1bd4b2677af7"}
                            alt=""
                        />
                        <label htmlFor="fileInput">
                            <i className="settingsPPIcon far fa-user-circle"></i>
                        </label>
                        <input 
                            type="file" 
                            id="fileInput" 
                            style={{display: "none"}} 
                            onChange={e => setFile(e.target.files[0])} 
                        />
                    </div>
                    <label>Username</label>
                    <input 
                        type="text" 
                        defaultValue={user.username}
                        // onChange={e => setUsername(e.target.value)}
                        ref={usernameRef}
                        required
                    />
                    <label>Email</label>
                    <input 
                        type="text" 
                        defaultValue={user.email} 
                        // onChange={e => setEmail(e.target.value)} 
                        ref={emailRef}
                        required
                    />
                    <label>Password</label>
                    <input 
                        type="password" 
                        // onChange={e => setPassword(e.target.value)}
                        ref={passwordRef}
                        required
                    />
                    <button className="settingsSubmit" type="submit">Update</button>
                    {success && <span style={{ color: "teal", textAlign: "center", marginTop: "20px" }}>Profile has been updated.</span>}
                </form>
            </div>
            <Sidebar />
        </div>
    )
}
