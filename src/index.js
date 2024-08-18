import "./style.css";

let grades = true;

function domController(){
    const content=document.querySelector("#content");
    const input=document.querySelector("#city");
    const title = document.querySelector(".title");
    const magnify = document.querySelector("#search");
    const grades = document.querySelector("#grades");

    return{content,input,title,magnify,grades}
}

function addLoading(dom){
    const loading = document.createElement('div');
    loading.classList.add('loading');
    dom.content.append(loading);
}

function addErrorMesage(dom,error){
    const errorElement = document.createElement('p');
    errorElement.classList.add('description');
   
    if(error=="TypeError: Failed to fetch"){
        errorElement.textContent="API connection error";     
    }else{
        errorElement.textContent=`An error has occurred: ${error}`;
    }
    dom.content.append(errorElement);
}

function deleteContent(dom){
    while(dom.content.firstChild){
        dom.content.removeChild(dom.content.firstChild);
    };
}

function addInformation(data,icon,dom){
    console.log(data);
    let addres = data.resolvedAddress;
    let temperature = data.currentConditions.temp;
    let conditions = data.currentConditions.conditions;
    let description = data.description;

    temperature = Math.round(parseFloat(temperature));

    const divImage = document.createElement('div');
    const image = document.createElement('img');
    const divInformation = document.createElement('div');
    const temp = document.createElement('h2');
    const conditionsDom = document.createElement('h2');
    const descriptionDom = document.createElement('h3');
    const addresDom = document.createElement('h1');

    divImage.classList.add('state');
    divImage.append(image);

    image.src=icon;

    divInformation.classList.add('flex');
    divInformation.appendChild(temp);
    divInformation.appendChild(conditionsDom);

    temp.classList.add('temp');

    if(grades){
        temp.textContent=`${temperature}ºF`;
    }else{
        temperature -= 32;
        temperature *= 5;
        temperature /= 9;
        temp.textContent=`${temperature}ºC`;
    }

    conditionsDom.textContent=conditions;
    descriptionDom.textContent=description;
    addresDom.textContent=addres;

    dom.content.appendChild(divImage);
    dom.content.appendChild(addresDom);
    dom.content.appendChild(divInformation);
    dom.content.appendChild(descriptionDom);
}

function addInitialDescription(dom){
    const descriptionDom = document.createElement('p');

    descriptionDom.textContent="This is the Weather Application project of The Odin Project. This project uses asynchronous javascript functions, promises, API queries, and the keywords async and await to give the user today's weather information for any city they search for. Please enter a city or Country name to find out today's weather.You can change the measurement system in the button in the upper right corner.";
    descriptionDom.classList.add('description');
    dom.content.appendChild(descriptionDom);
}

async function wheatherReport(place,dom){
    try{
        deleteContent(dom);
        addLoading(dom);
        const weatherResponse = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${place}?key=TTZXWVDCBTHFKCBJ7FE7TBY8Y`,{mode:'cors'})
        const weatherData = await weatherResponse.json();
        const iconResponse = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=w23oAmsqlis8KZ9Jh68bEVOjKaqBesfz&s=${weatherData.currentConditions.icon}`, {mode: 'cors'});
        const iconData = await iconResponse.json();
        const iconUrl=iconData.data.images.original.url;
        deleteContent(dom);
        addInformation(weatherData,iconUrl,dom);
    }catch(error){
        deleteContent(dom);
        addErrorMesage(dom,error);
    }
}

function main(){
    const dom = domController();
    
    dom.input.addEventListener("keypress",(event)=>{
        if(event.key=="Enter" && event.target.value != ""){
            let ubication = event.target.value;
            wheatherReport(ubication,dom);
        }
    })

    dom.magnify.addEventListener("click",(event)=>{
        if(dom.input.value != ""){
            let ubication = dom.input.value;
            wheatherReport(ubication,dom);
        }
    })

    dom.grades.addEventListener("click",(event)=>{
        const temp = document.querySelector(".temp");
        if(grades){
            dom.grades.textContent="ºC";
            grades=false;
            if(temp){
                let tempConvertion =parseFloat(temp.textContent)-32;
                tempConvertion *= 5;
                tempConvertion /= 9;
                tempConvertion = Math.round(tempConvertion);
                temp.textContent = `${tempConvertion}ºC`
            }
        }else{
            dom.grades.textContent="ºF";
            grades=true;
            if(temp){
                let tempConvertion = Math.round(parseFloat(temp.textContent)*9);
                tempConvertion /= 5;
                tempConvertion += 32;
                tempConvertion = Math.round(tempConvertion);
                temp.textContent = `${tempConvertion}ºF`
            }
        }
    })

    dom.title.addEventListener("click",()=>{
        deleteContent(dom);
        addInitialDescription(dom);
    })

}

main();