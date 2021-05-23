import Component from '@ember/component';
import layout from '../templates/components/timer';

import { later, once } from '@ember/runloop';
import { computed } from '@ember/object';

import moment from 'moment';


export default class TimerComponent extends Component {
  layout = layout

  @computed('now', 'to')
  get hasEnded () {
    return this.to - this.now <= 0 
  }

  @computed ('now','to')
  get duration () {
    if (this.hasEnded)
      return moment.duration(0)
    
    return moment.duration(this.to.diff(this.now))
  }

  @computed('duration')
  get hours () {
    return this._displayableResult(Math.floor(this.duration.as('hours')));
  }

  @computed('duration')
  get minutes () {
    return this._displayableResult(Math.floor(this.duration.as('minutes'))%60);
  }

  @computed('duration')
  get seconds () {
    return this._displayableResult(Math.floor(this.duration.as('seconds'))%60);
  }

  constructor () {
    super(...arguments)
    this.tick()
  }

  tick () {
    if (this.hasEnded) {
      // countdown ended; call the action if available
      if (typeof this.onEnd == 'function')
        once(this.onEnd)

      //and return early
      return;
    } 

    this.set('now', moment())
    later( () => {
      this.tick()
    }, 1000)
  }

  _displayableResult(result) {
    if (result < 10) {
      return `0${result}`;
    }

    return `${result}`;
  }
}

