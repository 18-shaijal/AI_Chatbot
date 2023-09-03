const chatinput= document.querySelector(".chat-input textarea")
const sendchatbtn= document.querySelector(".chat-input span ")
const chatbox= document.querySelector(".chatbox ")
const chatbottoggle= document.querySelector(".chatbot-toggle ")
const chatbotclosebtn= document.querySelector(".closebtn ")
const inputchatheight= chatinput.scrollHeight;
let usermessage;
const API_KEY="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";

const createchatli =( message , classname)=>{
    const chatli=document.createElement("li");
    chatli.classList.add("chat" , classname);
    let chatcontent= classname ==="outgoing"? `<p></p>`:`<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatli.innerHTML= chatcontent;
    chatli.querySelector("p").textContent=message;
    return chatli;

}
const generateresponse=(incomingchatli)=>{
    const API_URL="https://api.openai.com/v1/chat/completions";
    const messageElement=incomingchatli.querySelector("p");
    const requestoption={
        method:"POST",
        headers:{
            "Content-type":"application/json",
            "Authorization":`Bearer ${API_KEY}`
        },
        body:JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [  {role: "user", content:usermessage}],
        })
       
    }
    fetch(API_URL,requestoption).then(res=>res.json()).then(data=>{
        messageElement.textContent=data.choices[0].message.content;
    }).catch((error)=>{
        messageElement.classList.add("error");
        messageElement.textContent="Oops! Something went wrong. Please try again.";
    }).finally(()=> chatbox.scrollTo(0,chatbox.scrollHeight));
}
const handlechat = () =>{
      usermessage = chatinput.value.trim();
      if(!usermessage) return;
      chatinput.value="";
      chatinput.style.height=`${inputchatheight}px`;
      //Append the user message to the chatbox
     chatbox.appendChild( createchatli(usermessage,"outgoing"));
     chatbox.scrollTo(0,chatbox.scrollHeight);
     setTimeout(()=>{
        //display "thinking.." message while waiting for the respose
        const incomingchatli=createchatli("thinking.....","incoming")
        chatbox.appendChild(incomingchatli);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateresponse(incomingchatli);
     },600)
}
chatinput.addEventListener("input",()=>{
    //adjust the height of input textarea based on its content
    chatinput.style.height=`${inputchatheight}px`;
    chatinput.style.height=`${chatinput.scrollHeight}px`;
})
chatinput.addEventListener("keydown",(e)=>{
    //if enter key is pressed 
    // width is greter than 800 px ,handle chat
    if(e.key ==="Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handlechat();
    }
})

sendchatbtn.addEventListener("click", handlechat)
chatbottoggle.addEventListener("click",()=>document.body.classList.toggle("show-chatbot"));
chatbotclosebtn.addEventListener("click",()=>document.body.classList.remove("show-chatbot"));