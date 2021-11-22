import "./post.css";
import { Link } from "react-router-dom";

export default function Post({post}) {
    return (
        <>
        <div className="post">
            {post.photo && (
                <img 
                    className="postImg"
                    src={post.photo} 
                    alt="" 
                />  
            )}                      
            <div className="postInfo">
                
                <Link to={`/posts/${post._id}`} className="link">
                    <span className="postTitle">{post.title}</span>
                </Link>           
                <span className="postCat">{post.category?.toUpperCase()}</span>     
                <hr />
                <span className="postDate">{new Date(post.updatedAt).toDateString()}</span>
                <p className="postDesc">{post.desc}</p>
            </div>
        </div>
        </>
    )
}
