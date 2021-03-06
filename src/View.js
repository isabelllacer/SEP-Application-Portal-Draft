import React from 'react';
import './View.css';
import firebase from './firebase.js';
import fill from './pictures/fill.png';
import pencil from './pictures/black_pencil.png';
import eye from './pictures/black_eye.png';
import { Link } from 'react-router-dom';

class SubscoreBox extends React.Component {
  constructor() {
    super();
    this.state = {
      active: false
    }
  }

  scoreClick() {
    const newActive = !this.state.active;
    this.setState({
      active: newActive
    });
  }

  listClick(option) {
      this.scoreClick();
      this.props.onClick(option);
  }

  render() {
  let color;
  switch (this.props.score + '') {
    case '5':
      color = 'five';
      break;
    case '4':
      color = 'four';
      break;
    case '3':
      color = 'three';
      break;
    case '2':
      color = 'two';
      break;
    default:
      color = 'one';
    }

    const options = ["5", "4", "3", "2", "1"];
    const show = this.state.active ? "active" : "inactive";

    return <div className="subscoreContainer">
          <div className={"subscore sub" + color} onClick={() => this.scoreClick()}>
            <div className="subnumber">{this.props.score}</div>
            <div>Score</div>
          </div>
          <div className={"suboptContainer " + show}>
          {options.map((option) => {
            return (this.props.score + "") !== option ?
              <div className={"subscoreOpt "} onClick={() => this.listClick(option)}>{option}</div> :
              <div></div>;
          })}
          </div>
        </div>;
  }
}

class Subquestion extends React.Component {
  render() {
    const score = this.props.score || 0;
    const scoreBox = score !== 0 ?
      <SubscoreBox score={score} onClick={(option) => this.props.onClick(option)}/>:
      <div></div>;

    const subtitle = this.props.subtitle || "";
    const subtitleBox = subtitle === "" ?
      <div></div> :
      <div className="subtitle">
      {scoreBox}
      <div>{this.props.subtitle}</div>
      </div>;

    return (
      <div className="subquestion">
        {subtitleBox}
        <div className={"content" + (subtitle === "" ? " bigger" : "")}>{this.props.content}</div>
      </div>
    );
  }
}

class ScoreBox extends React.Component {
  constructor() {
    super();
    this.state = {
      active: false
    }
  }

  scoreClick() {
    const newActive = !this.state.active;
    this.setState({
      active: newActive
    });
  }

  listClick(option) {
      this.scoreClick();
      this.props.onClick(option);
  }

  render() {
  let color;
  switch (this.props.score + '') {
    case '5':
      color = 'five';
      break;
    case '4':
      color = 'four';
      break;
    case '3':
      color = 'three';
      break;
    case '2':
      color = 'two';
      break;
    default:
      color = 'one';
    }

    const options = ["5", "4", "3", "2", "1"];
    const show = this.state.active ? "active" : "inactive";

    return <div className="scoreContainer">
          <div className={"score " + color} onClick={() => this.scoreClick()}>
            <div className="number">{this.props.score}</div>
            <div>Score</div>
          </div>
          <div className={"optContainer " + show}>
          {options.map((option) => {
            return (this.props.score + "") !== option ?
              <div className={"scoreOpt "} onClick={() => this.listClick(option)}>{option}</div> :
              <div></div>;
          })}
          </div>
        </div>;
  }
}

/* Cases:
Subtitle Scores
Notes Format (No Title Score)
Interviwers Slot
*/
class Questions extends React.Component {
  render() {
    const score = this.props.score || 0;
    const scoreBox = score !== 0 ?
    <ScoreBox score={score} onClick={(option) => this.props.scoreClick(option)}/> :
      <div className="filler"></div>;

      const interviewers = this.props.interviewers || [];
      const interview = interviewers.length > 0 ?
      <div className="interviewers">
        <span className="bolded">Interviewers: </span>
        {interviewers.map((i, index) => {
          const end = index === interviewers.length - 1 ? "" : ", ";
          return i + end;
        })}
      </div> :
      <div></div>;

    return (
      <div className="questions">
        <div className="title">
          {scoreBox}
          <div className=""> {this.props.title}</div>
        </div>
        {interview}
        {this.props.subs.map((subq, index) => {
          return <Subquestion subtitle={subq.subtitle} onClick={(option) => this.props.subscoreClick(option, index)} score={subq.score} content={subq.content}/>;
        })}
      </div>
    );
  }
}

//own internal state of showing dropdown
//list of absolutely positioned divs
//onclick of each passed from parent to update app state.
//remember status is capital letter first

//clicking an option should close dropdown. add onto passed in function
class Status extends React.Component {
  constructor() {
    super();
    this.state = {
      active: false
    }
  }

  editClick() {
    const newActive = !this.state.active;
    this.setState({
      active: newActive
    });
  }

  optionClick(option) {
      this.editClick();
      this.props.onClick(option);
  }

  render() {
    const options = ["Pending", "Next Round", "Bid", "Cut"];
    const show = this.state.active ? "active" : "inactive";

    return (
      <div className="dropdown">
        <div className="statusContainer" onClick={() => this.editClick()}>
          <div className="status">
            {this.props.status}
          </div>
          <div className="statusEdit">
            <img className="pencil" src={pencil} />
          </div>
        </div>
        <div className={"optionContainer " + show}>
          {options.map((opt) => {
            return opt !== this.props.status ?
            <div className="option" onClick={() => this.optionClick(opt)}>
              {opt}
            </div> :
            <div></div>;
          })}
        </div>
      </div>
    );
  }
}

class Detail extends React.Component {
  render() {
    const category = this.props.category;
    if (category === "resume") {
      return (
        <div className="resume">
          <span className="bolded">
            <a className="resumeLink" target="_blank" href={this.props.value}> Open Resume </a>
          </span>
        </div>
      );
    }

    return (
      <div className="detail">
        <span className="bolded"> {category === "gpa" ? category.toUpperCase() : category.charAt(0).toUpperCase() + category.slice(1)}: </span>
        {this.props.value}
      </div>
    );
  }
}

class View extends React.Component {
  constructor() {
    super();
    this.state = {
      appId: null,
      status: "",
      appInfo: {
        applicant: "",
        major: "",
        year: "",
        gpa: "",
        resume: "",
        email: "",
        phone: ""
      },
      qs: [],
      appList: []
    }
  }

  //will need to parse out left column info and right column info into state
  //TODO: nullstate of score but needed eventually
  //REMEMBER order of Qs matter (currently determined by firebase order)
  componentDidMount() {
    var app = {};
    let newList = [];

    firebase.auth().signInWithEmailAndPassword("isabelllacer@berkeley.edu", "123456").catch(function(error) {
      console.log(error)
    });

    const itemsRef = firebase.database().ref('applicants');
    itemsRef.once('value', (snapshot) => {
      let items = snapshot.val();
      for (let item in items) {
        newList.push({
          id: item,
          applicant: items[item].applicant
        });
      }
    });

    const appRef = firebase.database().ref('applicants/'+this.props.match.params.id);
    appRef.on('value', (snapshot) => {
      app = snapshot.val();

      const stat = app["status"];
      delete app.status;
      app["gpa"] = "4.0";
      app["resume"] = "https://drive.google.com/open?id=1895ccUJdAmlJzZyo0AIFP27NH9Bjmdn7";
      app["email"] = "apalmer@berkeley.edu";
      app["phone"] = "4085504766";

      let newQs = [];
      newQs.push({
        title: "Notes",
        subs: [{content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa. `
      }]});

      newQs.push({
        title: "Application Questions",
        score: 5,
        subs: [{subtitle: "List your other time commitments for the semester.",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa.`
        },
        {subtitle: "Tell us about your interests.",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa.`
        },
        {subtitle: `Why do you want to be in Sigma Eta Pi? How will you
          contribute to the organization? (250 words or less)`,
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa. Fusce nec nunc ante. Nam feugiat elit
          justo, ac eleifend urna dapibus vel. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Mauris vehicula, erat ut mattis volutpa.`
      }]});

      newQs.push({
        title: "Professional Interview",
        score: 2,
        interviewers: ["LeAnne", "Isabel", "Alex"],
        subs: [{subtitle: "List your other time commitments for the semester.",
        score: 5,
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa.`
        },
        {subtitle: "Tell us about your interests.",
        score: 4,
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa.`
        },
        {subtitle: `Why do you want to be in Sigma Eta Pi? How will you
          contribute to the organization? (250 words or less)`,
        score: 3,
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce nec nunc ante. Nam feugiat elit justo, ac eleifend urna dapibus
          vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula, erat ut mattis volutpa. Fusce nec nunc ante. Nam feugiat elit
          justo, ac eleifend urna dapibus vel. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Mauris vehicula, erat ut mattis volutpa.`
      }]});

      this.setState({
        appId: this.props.match.params.id,
        status: stat,
        appInfo: app,
        qs: newQs,
        appList: newList
      });
    });
  }

  subscoreClick(option, i1, i2) {
    //firebase.database().ref('applicants/'+this.state.appId).update({
    //  status: option
    //});
    //set qs at given index's score to option
    let newQs = this.state.qs.slice();
    newQs[i1].subs[i2].score = option;
    this.setState({
      appId: this.state.appId,
      status: this.state.status,
      appInfo: this.state.appInfo,
      qs: newQs,
      appList: this.state.appList
    });
  }

  scoreClick(option, index) {
    //firebase.database().ref('applicants/'+this.state.appId).update({
    //  status: option
    //});
    //set qs at given index's score to option
    let newQs = this.state.qs.slice();
    newQs[index].score = option;
    this.setState({
      appId: this.state.appId,
      status: this.state.status,
      appInfo: this.state.appInfo,
      qs: newQs,
      appList: this.state.appList
    });
  }

  statusClick(option) {
    firebase.database().ref('applicants/'+this.state.appId).update({
      status: option
    });
  }

  render() {
    let face = fill;
    try {
     face = require('./pictures/' + this.state.appInfo.applicant.replace(/\s+/g, '-').toLowerCase()+'.jpg')
    }
    catch (e) {
     console.log('Error in retrieving photo');
     console.log(e)
    }
    return (
      <div className="container">
        <div className="leftCol">
          <div className="name">
            {this.state.appInfo.applicant}
          </div>
          <div className="shot">
            <img className='headPic' src={face}/>
          </div>
          <Status status={this.state.status} onClick={(option) => this.statusClick(option)}/>
          {Object.keys(this.state.appInfo).map((field) => {
            return <Detail category={field} value={this.state.appInfo[field]}/>;
          })}
        </div>
        <div className="rightCol">
        {this.state.qs.map((question, index) => {
          return <Questions
            title={question.title}
            score={question.score}
            interviewers={question.interviewers}
            subs={question.subs}
            scoreClick={(option) => this.scoreClick(option, index)}
            subscoreClick={(option, i2) => this.subscoreClick(option, index, i2)}
            />;
        })}
        </div>
      </div>
    );
  }
}

export default View;
