import { RedCheckMark, BasicIdCard, ClibBoard, CheckedClibBoard, Availability, Avatar, LocationWork, ResumeUpload } from "./svgForStepper"

export default function JobSeekerStepper(){
    return(
        <ol className="relative text-neutral-300 border-s border-neutral-300 dark:border-neutral-300 dark:text-neutral-300">                  
            <li className="mb-10 ms-6 flex items-center">            
                <span className="absolute flex items-center justify-center w-8 h-8 bg-neutral-500 rounded-full -start-4 ring-4 ring-white dark:ring-neutral-950 dark:bg-neutral-500">
                    <BasicIdCard />
                </span>
                <h3 className="font-medium leading-tight text-neutral-300">Basic Info</h3>
                
            </li>
            <li className="mb-10 ms-6 flex items-center">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-neutral-500 rounded-full -start-4 ring-4 ring-white dark:ring-neutral-950 dark:bg-neutral-500">
                    <ResumeUpload />
                </span>
                <h3 className="font-medium leading-tight text-neutral-300">Upload Resume</h3>
            </li>
            <li className="mb-10 ms-6 flex items-center">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-neutral-500 rounded-full -start-4 ring-4 ring-white dark:ring-neutral-950 dark:bg-neutral-500">
                    <CheckedClibBoard />
                </span>
                <h3 className="font-medium leading-tight text-neutral-300">Review Extracted Info</h3>
            </li>
            <li className="mb-10 ms-6 flex items-center">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-neutral-500 rounded-full -start-4 ring-4 ring-white dark:ring-neutral-950 dark:bg-neutral-500">
                    <LocationWork />
                </span>
                <h3 className="font-medium leading-tight text-neutral-300">Work Prefs</h3>
            </li>
            <li className="mb-10 ms-6 flex items-center">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-neutral-500 rounded-full -start-4 ring-4 ring-white dark:ring-neutral-950 dark:bg-neutral-500">
                    <Availability />
                </span>
                <h3 className="font-medium leading-tight text-neutral-300">Availability</h3>
            </li>
            <li className="mb-10 ms-6 flex items-center">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-neutral-500 rounded-full -start-4 ring-4 ring-white dark:ring-neutral-950 dark:bg-neutral-500">
                    <ClibBoard />
                </span>
                <h3 className="font-medium leading-tight text-neutral-300">Clearance</h3>
            </li>
            <li className="ms-6 flex items-center">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-neutral-500 rounded-full -start-4 ring-4 ring-white dark:ring-neutral-950 dark:bg-neutral-500">
                    <Avatar />
                </span>
                <h3 className="font-medium leading-tight text-neutral-300">Generate Avatar</h3>
            </li>
        </ol>


    )
}