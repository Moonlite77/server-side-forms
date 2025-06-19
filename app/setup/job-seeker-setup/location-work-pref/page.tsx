"use client"
import { useActionState, useState, useEffect, useCallback } from "react"
import { autoComplete, prefsAction } from "./actions"
import { useRouter } from 'next/navigation';
import LilRedSpinner from "@/components/ui/lilRedSpinner";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";

type StoredPrefs = {
    location: string
    relocate: boolean
    usCitizen: boolean
    remoteOnly: boolean
    completedStepFour: boolean
}

export default function LocationWorkPrefPage(){
    const [result, formAction, isPending]= useActionState(prefsAction, null)
    const [persistedData, setPersistedData] = useState<StoredPrefs | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPushingNewRoute, setIsPushingNewRoute] = useState(false)
    const router = useRouter();

    const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
    const [input, setInput] = useState("");

      useEffect(() => {
        const fetchPredictions = async () => {
        const predictions = await autoComplete(input);
        setPredictions(predictions ?? []);
    };
    fetchPredictions();
  }, [input]);


    //on mount read from local storage to see if the user has previously filled out info
        // On mount, read from localStorage
        useEffect(() => {
            const storedData = localStorage.getItem("prefsInfo");
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData) as StoredPrefs;
                    setPersistedData(parsedData);
                    console.log('Loaded from localStorage:', parsedData);
                } catch (error) {
                    console.error('Error parsing stored data:', error);
                    localStorage.removeItem("prefsInfo");
                }
            }
            setIsLoaded(true);
        }, []);
    
    // Save to localStorage when form is successfully submitted
        useEffect(() => {
            if (result?.success && result.data) {
                localStorage.setItem('prefsInfo', JSON.stringify(result.data));
                setPersistedData(result.data);
                console.log('Success! Data saved:', result.data);
                router.push('/setup/job-seeker-setup/availability');
                setIsPushingNewRoute(true);
            }
            
            if (result?.error) {
                console.log('Error:', result.error);
            }
        }, [result]);
    
        if (isPushingNewRoute){
            return <LilRedSpinner />
        }
        
        // Don't render the form until we've loaded from localStorage
        if (!isLoaded) {
            return <LilRedSpinner />;
        }

    
    return(
        <div>
            <h2 className="text-xl">Location</h2>
            <form className="flex flex-col" action={formAction}>
                <label>City, State, Country .. be as vague or specific as you want</label>
                <input className="border" type="text" list="cityCountryData" name="location" id="location" autoComplete="off" defaultValue={persistedData?.location || "" } onChange={(e) => setInput(e.target.value)}/>
                    <datalist id="cityCountryData">
                        {predictions.map((prediction) => (
                         <option key={prediction.place_id} value={prediction.description}>
                            {prediction.description}
                        </option>
                        ))}
                        <option value="Paris, France">Paris, France</option>
                        <option value="Tokyo, Japan">Tokyo, Japan</option>
                        <option value="San Francisco, California, United States">San Francisco, California, United States</option>
                    </datalist>
                    <div>
                        <label>Willing to relocate</label>
                        <input type="checkbox" value="true" name="relocate" id="relocate" defaultChecked={persistedData?.relocate === true}/>
                    </div>
                    <div>
                        <label>US Citizen or Green Card Holder</label>
                        <input type="checkbox" value="true" name="usCitizen" id="usCitizen" defaultChecked={persistedData?.usCitizen === true}/>
                    </div>
                    <div>
                        <label>Remote Only</label>
                        <input type="checkbox" value="true" name="remoteOnly" id="remoteOnly" defaultChecked={persistedData?.remoteOnly === true}/>
                    </div>             
                <button className="border" type="submit">Save and Continue</button>
                <div>{isPending ? "Loading..." : ""}</div>
            </form>
        </div>
    )
}