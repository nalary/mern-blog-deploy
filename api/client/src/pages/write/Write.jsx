import { useContext, useState } from "react";
import "./write.css";
import { Context } from "../../context/Context";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";
import { writeCall } from "../../apiCalls";

export default function Write() {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [category, setCategory] = useState("");
    const [file, setFile] = useState(null);
    const { user } = useContext(Context);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPost = {
            title,
            desc,
            category,
            username: user.username,            
        }; 
        
        if (file) {
            const fileName = file.name + "_" + Date.now();
            const storage = getStorage(app);
            const storageRef = ref(storage, `blog/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
    
            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
                    // Handle unsuccessful uploads
                    console.log(error);
                }, 
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {                    
                        newPost.photo = downloadURL;
                        writeCall(newPost, category.toLowerCase());
                    });
                }
            );   
        } else {
            writeCall(newPost, category.toLowerCase());
        }    
    };
    
    return (
        <div className="write">
            {file && 
                <img 
                    src={URL.createObjectURL(file)}
                    alt="" 
                    className="writeImg"
                />
            }            
            <form className="writeForm" onSubmit={handleSubmit}>
                <div className="writeFormGroup">
                    <label htmlFor="fileInput">
                        <i className="writeIcon fas fa-plus"></i>
                    </label>
                    <input 
                        type="file" 
                        id="fileInput" 
                        style={{display: "none"}}
                        onChange={e => setFile(e.target.files[0])}
                    />
                    <input 
                        type="text" 
                        placeholder="Title" 
                        className="writeInput" 
                        autoFocus
                        required
                        onChange={e => setTitle(e.target.value)}                        
                    />
                    <input 
                        type="text" 
                        placeholder="Category" 
                        className="writeInput"
                        required                        
                        onChange={e => setCategory(e.target.value)}
                    />
                </div>
                <div className="writeFormGroup">
                    <textarea 
                        placeholder="Tell your story..." 
                        type="text" 
                        className="writeInput writeText"
                        required
                        onChange={e => setDesc(e.target.value)}
                    />
                </div>
                <button className="writeSubmit" type="submit">Publish</button>
            </form>
        </div>
    )
}
