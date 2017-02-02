class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config === null || config === undefined) throw error;
        this.condition = config.initial;
        this.states=config.states;
        this.defaultState=config.initial;

        this.history =
            {
                past : new Array(),
                future: new Array(),
                current :0,
                newState: function (key) {
                    this.past[this.current++]=key;

                },
                get undo() {
                    let temp;
                    this.future.push(temp=this.past.pop());
                    return this.future[this.future.length];
                },
                get redo() {
                    this.current++;
                    return this.past[this.current];
                }
            }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.condition;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(!(state in this.states)) throw error;
        this.history.newState(this.condition);
        this.condition = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if(!(event in this.states[this.condition].transitions)) throw error;
        this.changeState(this.states[this.condition].transitions[event]);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.history = new Array();
        this.condition=this.defaultState;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if(event===undefined) return Object.getOwnPropertyNames(this.states);
        let output = new Array();

        for (let key in this.states)
        {
            if(event in this.states[key].transitions) output.push(key);
        }
        return output;
    }
    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.condition==this.defaultState && this.history.current==0) return false;
        this.changeState(this.history.undo);
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.condition==this.defaultState && !this.history.length) return false;
        this.condition=this.history.redo;
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {}
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
