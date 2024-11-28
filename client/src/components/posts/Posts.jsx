import Post from "../post/Post";
import "./posts.scss";

const Posts = () => {
  const posts = [
    {
      id: 1,
      name: "Aryan",
      userId: 1,
      profilePic:
        "https://imageio.forbes.com/specials-images/imageserve/6545fb35ee5295c6716803b2/FC-Barcelona-will-probably-never-see-Lionel-Messi-wear-their-colours-again-/960x0.jpg?format=jpg&width=960",
      desc: "Football is more than just a sport; it is a universal passion. Loved by billions, it unites people across cultures and brings unmatched excitement. Simple yet deeply strategic, it is a game where a single goal can create history.From iconic rivalries to grassroots initiatives, football inspires pride, identity, and even social change. It is a shared language that connects the world, reminding us of the joy found in unity and competition.Whether played on local fields or celebrated in grand stadiums, football truly lives up to its name as the beautiful game.",
      
      
      img :"https://cdn.britannica.com/51/190751-050-147B93F7/soccer-ball-goal.jpg",
   
    },
    
  ];

  return <div className="posts">
    {posts.map(post=>(
      <Post post={post} key={post.id}/>
    ))}
  </div>;
};

export default Posts;
