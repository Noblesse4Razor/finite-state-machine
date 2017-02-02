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
                current : this.condition,
                newState: function (key) {
                    this.past.push(key);

                },
                get undo() {
                    let temp;
                    this.future.push(this.current);
                    return this.past.pop();
                },
                get redo() {
                    let temp;
                    this.past.push(temp=this.future.pop());
                    return temp;
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
        this.history.past = this.history.future =  new Array();

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
        if(!this.history.past.length) return false;
        this.condition=this.history.undo;
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(!this.history.future.length) return false;
        this.condition=this.history.redo;
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history.future = this.history.past = new Array();
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
