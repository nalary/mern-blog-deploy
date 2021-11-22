import "./header.css";

export default function Header() {
    return (
        <div className="header">
            <div className="headerTitles">
                <span className="headerTitleSm">H O : S T O R Y</span>
                <span className="headerTitleLg">Blog</span>
            </div>
            <img className="headerImg" 
                src="https://firebasestorage.googleapis.com/v0/b/mern-blog-4c8dc.appspot.com/o/blog%2Fcover.jpg?alt=media&token=d3a27039-979c-4260-b5a2-99860bfbe57d" 
                alt="" 
            />
        </div>
    )
}
