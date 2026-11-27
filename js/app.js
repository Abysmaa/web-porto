(function(){
  var tabs=document.querySelectorAll(".tabs button");
  var rows=document.querySelectorAll(".rows details");
  var themeButton=document.querySelector(".theme-toggle");
  var themeLabel=document.getElementById("theme-label");
  var progressBar=document.getElementById("scroll-progress-bar");
  var topButton=document.querySelector(".back-to-top");
  var galleries=document.querySelectorAll(".experience-gallery");
  var photoViewer=document.querySelector(".photo-viewer");
  var viewerImage=photoViewer.querySelector(".photo-viewer__image");
  var viewerCaption=document.getElementById("photo-viewer-caption");
  var viewerClose=photoViewer.querySelector(".photo-viewer__close");
  var chatAssistant=document.querySelector(".chat-assistant");
  var chatLauncher=document.querySelector(".chat-launcher");
  var chatPanel=document.querySelector(".chat-panel");
  var chatClose=document.querySelector(".chat-panel__close");
  var chatForm=document.getElementById("chat-form");
  var chatInput=document.getElementById("chat-input");
  var chatMessages=document.getElementById("chat-messages");
  var chatTopics=document.querySelector(".chat-topics");
  var chatStatus=document.querySelector(".chat-panel__status");
  var chatApiUrl=typeof window.ABIGEIL_CHAT_API_URL==="string"?window.ABIGEIL_CHAT_API_URL.trim():"";
  var chatPending=false;
  var reducedMotion=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var prefersDark=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;
  var hero=document.querySelector(".hero");
  var heroGrid=hero.querySelector(".grid");
  var photo=hero.querySelector(".orn.photo");
  var backgroundScene=document.querySelector(".background-scene");
  var finePointer=window.matchMedia&&window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  chatStatus.textContent=chatApiUrl?"Didukung Gemini · konteks percakapan":"API Gemini belum dikonfigurasi";

  if(finePointer&&!reducedMotion){
    var sceneTicking=false;
    var sceneX=0;
    var sceneY=0;
    window.addEventListener("pointermove",function(event){
      sceneX=((event.clientX/window.innerWidth)-.5)*16;
      sceneY=((event.clientY/window.innerHeight)-.5)*16;
      if(!sceneTicking){
        window.requestAnimationFrame(function(){
          backgroundScene.style.setProperty("--scene-shift-x",sceneX.toFixed(1)+"px");
          backgroundScene.style.setProperty("--scene-shift-y",sceneY.toFixed(1)+"px");
          sceneTicking=false;
        });
        sceneTicking=true;
      }
    },{passive:true});
    window.addEventListener("blur",function(){
      backgroundScene.style.removeProperty("--scene-shift-x");
      backgroundScene.style.removeProperty("--scene-shift-y");
    });
    hero.addEventListener("pointermove",function(event){
      var bounds=hero.getBoundingClientRect();
      var x=(event.clientX-bounds.left)/bounds.width-.5;
      var y=(event.clientY-bounds.top)/bounds.height-.5;
      heroGrid.style.setProperty("--hero-tilt-x",(-y*3.5).toFixed(2)+"deg");
      heroGrid.style.setProperty("--hero-tilt-y",(x*4.5).toFixed(2)+"deg");
      photo.style.setProperty("--photo-tilt-x",(-y*8).toFixed(2)+"deg");
      photo.style.setProperty("--photo-tilt-y",(x*9).toFixed(2)+"deg");
    });
    hero.addEventListener("pointerleave",function(){
      heroGrid.style.removeProperty("--hero-tilt-x");
      heroGrid.style.removeProperty("--hero-tilt-y");
      photo.style.removeProperty("--photo-tilt-x");
      photo.style.removeProperty("--photo-tilt-y");
    });
  }

  function set(m){
    tabs.forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.mode===m))});
    var visible=0;
    rows.forEach(function(r){
      r.hidden=m!=="all"&&r.dataset.tags.indexOf(m)===-1;
      if(!r.hidden){visible++}
    });
    document.getElementById("filter-status").textContent=m==="all"?"Semua proyek ditampilkan":visible+" proyek ditampilkan";
  }

  tabs.forEach(function(b){b.addEventListener("click",function(){set(b.dataset.mode)})});
  set("all");

  function setTheme(isDark){
    document.documentElement.dataset.theme=isDark?"dark":"light";
    themeButton.setAttribute("aria-pressed",String(isDark));
    themeButton.setAttribute("aria-label",isDark?"Aktifkan tema terang":"Aktifkan tema gelap");
    themeLabel.textContent=isDark?"Tema terang":"Tema gelap";
  }
  setTheme(prefersDark);
  themeButton.addEventListener("click",function(){
    setTheme(themeButton.getAttribute("aria-pressed")!=="true");
  });

  var revealItems=document.querySelectorAll("main section, footer");
  if("IntersectionObserver" in window){
    var revealObserver=new IntersectionObserver(function(entries,observer){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.12});
    revealItems.forEach(function(item){
      item.classList.add("reveal");
      revealObserver.observe(item);
    });
  }else{
    revealItems.forEach(function(item){item.classList.add("is-visible")});
  }

  var ticking=false;
  function updateScroll(){
    var maxScroll=document.documentElement.scrollHeight-window.innerHeight;
    var progress=maxScroll>0?window.scrollY/maxScroll*100:0;
    progressBar.style.width=Math.min(100,Math.max(0,progress))+"%";
    var showTop=window.scrollY>420;
    topButton.classList.toggle("is-visible",showTop);
    topButton.tabIndex=showTop?0:-1;
    ticking=false;
  }
  window.addEventListener("scroll",function(){
    if(!ticking){
      window.requestAnimationFrame(updateScroll);
      ticking=true;
    }
  },{passive:true});
  updateScroll();
  topButton.addEventListener("click",function(){
    window.scrollTo({top:0,behavior:reducedMotion?"auto":"smooth"});
  });
  if(typeof photoViewer.showModal==="function"){
    galleries.forEach(function(gallery){
      gallery.addEventListener("click",function(event){
        var button=event.target.closest(".experience-gallery__zoom");
        if(!button){return}
        var image=button.querySelector("img");
        var caption=button.closest("figure").querySelector("figcaption");
        viewerImage.src=image.currentSrc||image.src;
        viewerImage.alt=image.alt;
        viewerCaption.textContent=caption.textContent;
        photoViewer.showModal();
      });
    });
    viewerClose.addEventListener("click",function(){photoViewer.close()});
    photoViewer.addEventListener("keydown",function(event){
      if(event.key==="Escape"){
        event.preventDefault();
        photoViewer.close();
      }
    });
    photoViewer.addEventListener("click",function(event){
      if(event.target===photoViewer){photoViewer.close()}
    });
  }

  function setChatOpen(isOpen){
    chatAssistant.classList.toggle("is-open",isOpen);
    chatPanel.hidden=!isOpen;
    chatLauncher.setAttribute("aria-expanded",String(isOpen));
    chatLauncher.setAttribute("aria-label",isOpen?"Tutup Abigeil":"Buka Abigeil");
    if(isOpen){chatInput.focus()}
    else{chatLauncher.focus()}
  }

  function addChatMessage(text,kind,links){
    var message=document.createElement("article");
    message.className="chat-message chat-message--"+kind;
    if(kind==="assistant"){
      var label=document.createElement("span");
      label.className="chat-message__label";
      label.textContent="ABIGEIL ✦";
      message.appendChild(label);
    }
    var paragraph=document.createElement("p");
    paragraph.textContent=text;
    message.appendChild(paragraph);
    (links||[]).forEach(function(item){
      var link=document.createElement("a");
      link.href=item.href;
      link.textContent=item.label;
      if(item.external){
        link.target="_blank";
        link.rel="noopener noreferrer";
      }
      message.appendChild(link);
    });
    chatMessages.appendChild(message);
    chatMessages.scrollTop=chatMessages.scrollHeight;
    return message;
  }

  function buildChatHistory(){
    var messages=Array.prototype.slice.call(chatMessages.querySelectorAll(".chat-message--user,.chat-message--assistant:not(.chat-message--typing)"));
    messages.shift();
    return messages.map(function(message){
      var paragraph=message.querySelector("p");
      if(!paragraph){return null}
      var content=paragraph.textContent;
      var links=Array.prototype.slice.call(message.querySelectorAll("a"));
      if(links.length){
        content+="\n"+links.map(function(link){return link.textContent+" ("+link.getAttribute("href")+")"}).join("\n");
      }
      return{
        role:message.classList.contains("chat-message--user")?"user":"assistant",
        content:content.slice(0,1800)
      };
    }).filter(Boolean).slice(-10);
  }

  async function askPortfolio(question){
    var cleaned=question.trim();
    if(!cleaned||chatPending){return}
    addChatMessage(cleaned,"user");
    chatInput.value="";
    chatPending=true;
    chatInput.disabled=true;
    chatTopics.querySelectorAll("button").forEach(function(button){button.disabled=true});
    var typing=document.createElement("article");
    typing.className="chat-message chat-message--assistant chat-message--typing";
    typing.setAttribute("aria-label","Asisten sedang menyiapkan jawaban");
    for(var dot=0;dot<3;dot++){typing.appendChild(document.createElement("span"))}
    chatMessages.appendChild(typing);
    chatMessages.scrollTop=chatMessages.scrollHeight;
    var errorMessage="";
    try{
      if(!chatApiUrl){
        errorMessage="Abigeil AI belum aktif. URL API Vercel perlu diatur oleh pemilik situs.";
        throw new Error(errorMessage);
      }
      var response=await fetch(chatApiUrl,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messages:buildChatHistory()})
      });
      var result=await response.json();
      if(!response.ok){
        errorMessage=result&&typeof result.error==="string"?result.error:"Layanan Gemini gagal (HTTP "+response.status+").";
        throw new Error(errorMessage);
      }
      if(!result||typeof result.answer!=="string"||!result.answer.trim()){
        errorMessage="Gemini mengirim jawaban kosong. Silakan coba lagi.";
        throw new Error(errorMessage);
      }
      addChatMessage(result.answer.trim(),"assistant");
    }catch(error){
      console.error("Abigeil Gemini request failed:",error);
      addChatMessage(errorMessage||"Abigeil tidak dapat terhubung ke Gemini. Periksa koneksi lalu coba lagi.","assistant");
    }finally{
      typing.remove();
      chatPending=false;
      chatInput.disabled=false;
      chatTopics.querySelectorAll("button").forEach(function(button){button.disabled=false});
      if(chatAssistant.classList.contains("is-open")){chatInput.focus()}
    }
  }

  chatLauncher.addEventListener("click",function(){
    setChatOpen(!chatAssistant.classList.contains("is-open"));
  });
  chatClose.addEventListener("click",function(){setChatOpen(false)});
  chatForm.addEventListener("submit",function(event){
    event.preventDefault();
    askPortfolio(chatInput.value);
  });
  chatTopics.addEventListener("click",function(event){
    var button=event.target.closest("[data-chat-question]");
    if(button){askPortfolio(button.dataset.chatQuestion)}
  });
  chatPanel.addEventListener("keydown",function(event){
    if(event.key==="Escape"&&chatAssistant.classList.contains("is-open")){
      event.preventDefault();
      setChatOpen(false);
    }
  });
})();
