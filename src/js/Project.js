/**
 * Project.js
 *
 * This class handles the initialization of a web project by preloading assets
 * (images and Lottie animations) and managing the transition from the preloader
 * to the main site content using GSAP animations.
 *
 * Dependencies:
 * - GSAP (GreenSock Animation Platform)
 * - @terrahq/helpers/preloadImages
 * - @terrahq/helpers/preloadLotties
 * - @js/Main.js (dynamically imported when animation reaches 50%)
 *
 * ---
 * TERRA CLASS PATTERN
 * ---
 * At Terra, we follow a consistent class structure:
 *
 * - constructor(): Sets up DOM references and class properties, then calls init() and events()
 * - this.DOM = {}: Object containing all DOM element references (querySelectorAll, querySelector)
 * - this.instances = []: Array/object to store instances of other classes or libraries
 * - init(): Initialization logic - setup libraries, fetch data, configure initial state
 * - events(): All addEventListener bindings go here - keeps event logic separated and organized
 *
 * This pattern ensures:
 * 1. Clear separation of concerns
 * 2. Predictable class structure across the codebase
 * 3. Easy to read, maintain, and debug
 * ---
 *
 * Example usage:
 *
 * import Project from './Project';
 * new Project();
 *
 */

import gsap from 'gsap';
class Project{
    constructor(){
        this.DOM = {
            images : document.querySelectorAll("img"),
        };
        this.debug = false; // Set to true to enable debug mode
      
        this.init();
    }
    async init(){
        console.log("Project initialized");
        try {
            // Preload images and lotties

            if(this.DOM.images){
                const { preloadImages } = await import("@terrahq/helpers/preloadImages");
                await preloadImages({
                    selector: this.DOM.images,
                });
            }

            
            // Simulate another async operation
            await new Promise(resolve => setTimeout(resolve, 2300));
     
        } catch (error) {
            console.error("Error during project initialization:", error);
        }
        finally {

            var tl = gsap.timeline({
                onUpdate: async () => {
                    // //* Check if the animation is at least 50% complete and the function hasn't been executed yet
                    if (tl.progress() >= 0.5 && !this.halfwayExecuted) {
                      this.halfwayExecuted = true;
                      const { default: Main } = await import("@js/Main.js");
                      new Main({
                        boostify: this.boostify,
                        debug: this.terraDebug,
                      });
          
                    }
                },
            });
            tl.to('.c--preloader-a',{
                delay:0.5,
                opacity:0,
                duration:0.5,
            })
     
        }
    }
}
export default Project;