import moment from "moment"
const fileFormat = (url) =>{
    const fileExtention = url.split(".").pop().toLowerCase();;
    if(fileExtention == "mp4" || fileExtention == "webm"){
        return "video"
    }
    if(fileExtention == "mp3" || fileExtention == "wav"){
        return "audio"
    }
    if(fileExtention == "png" || fileExtention == "jpg" || fileExtention == "jpeg" || fileExtention == "gif"){
        return "image"
    }

    return "file";
}

const transformImage = (url = "" , width=100 ) => url;
export {fileFormat,transformImage};


export const lastSevenDays = () =>{
    const days = [];
    const currentDate = moment();

    for (let i = 0; i < 7; i++) {
        days.unshift(currentDate.format("DD MMM"));
        currentDate.subtract(1, "days");
    }

    return days;
}

export const getOrSaveFromStorage = ({ key, value, get }) => {
    if (get) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error("Error parsing localStorage data:", error);
            return null;
        }
    } else {
        localStorage.setItem(key, JSON.stringify(value));
    }
};