/**
 * Main.js
 *
 * ---
 * TERRA CLASS PATTERN
 * ---
 * At Terra, we follow a consistent class structure:
 *
 * - constructor(): Sets up DOM references and class properties, then calls init() and events()
 * - this.DOM = {}: Object containing all DOM element references (querySelectorAll, querySelector)
 * - this.instances = []: Array/object to store instances of other classes or libraries
 * - init(): Initialization logic - setup libraries, instantiate modules, configure initial state
 * - events(): All addEventListener bindings go here - keeps event logic separated and organized
 *
 * This pattern ensures:
 * 1. Clear separation of concerns
 * 2. Predictable class structure across the codebase
 * 3. Easy to read, maintain, and debug
 * ---
 */

import Collapsify from "@terrahq/collapsify";

class Main{
    constructor(){
        this.init();
        this.events()
    }

    init(){
        //! Initialize libraries and modules here
        new Collapsify({});
    }

    events(){
    }

}
export default Main;