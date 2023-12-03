import './App.css';
import {useState} from 'react';

// 일정 입력 폼
function ToDoForm(props){
  return (
    <div className='formDiv'>
      <form onSubmit={(event)=>{
        event.preventDefault();
        let target = event.target;
        if(target.todo.value === null || target.todo.value === '' || target.todo.value === ' '){
          alert('해야할 일을 입력해주세요.');
          return;
        }
        
        let selDate = new Date(target.date.value);
        if(target.date.value === ''){
          alert("시간을 입력해주세요.");
          return;
        }
        let now = new Date();
        if(selDate - now <= 0){
          alert("현재 이후를 선택해주세요.")
          return;
        }

      
        let time = selDate.toTimeString().substring(0, 9);
        props.onCalender(target.todo.value, target.detail.value, selDate.toLocaleDateString(), time);
      }}>
        <p>
          <input type="submit" value="To Do List!"/>
        </p>
        <label htmlFor="todo"><input id="todo" type="text" name="todo" placeholder="To Do"/></label><br/>
        <label htmlFor="detail" ><textarea id="detail" name="detail" placeholder="Detail content" cols="22" rows="5"></textarea></label><br/>
        <label htmlFor="date">Date <input id="date" type="datetime-local"/></label>
      </form>
    </div>
  );
}


// 일정이 올라온 목록 태그
function List(props){
  const lis = [];
  const calenders = props.calenders;
  for(let i = 0; i < calenders.length; i++){
    lis.push(<ListBlock key={calenders[i].id} num={calenders[i].id} todo={calenders[i].todo} detail={calenders[i].detail} 
                  date={calenders[i].date} time={calenders[i].time} onDelect={(id)=>{
                    props.onDelect(id);
                  }} onUpdate={(id)=>{
                    props.onUpdate(id);
                  }}></ListBlock>)
  }
  return (
    <div id='list'>
      {lis}
    </div>
  );
}

// 일정 블록
function ListBlock(props){
    console.log(props.date + " " + props.time);
    let left = {float : "left", marginLeft:"25px"};
    let right = {float : "right", marginRight : "25px"};
    let [limitDate, setLimitDate] = useState(null);
    let [limitTime, setLimitTime] = useState(null);
    
    let [check, setCheck] = useState(true);
    let months = [
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ];
    
    function timeOut(){
      let now = new Date();
      let test = new Date(props.date + " " + props.time);
      if(test - now > 0){
        let diff = test - now;
        let cSec = 1000;
        let cMin = cSec * 60;
        let cHour = cMin * 60;
        let cDay = cHour * 24;
        let cMonth = cDay * 30;
        let cYear = cMonth * 12;
        const diffYear = Math.floor((diff / cYear));
        const diffMonth = Math.floor((diff / cMonth) % 12);
        const diffDay = Math.floor((diff / cDay) % months[test.getMonth()]);
        const diffHour = Math.floor((diff / cHour) % 24);
        const diffMin = Math.floor((diff / cMin) % 60);
        const diffSec = Math.floor(diff / cSec % 60);
        setLimitDate(diffYear + ". " + diffMonth + ". " + diffDay);
        setLimitTime(diffHour + ":" + diffMin + ":" + diffSec);
      } else {
        setCheck(false);
        setLimitDate(0 + ". " + 0 + ". " + 0);
        setLimitTime(0 + ":" + 0 + ":" + 0);
      }
  }
  let timeMove = null;


    
  return (
    <li className="block" key={props.num} onDoubleClick={(event)=>{
      let current = event.currentTarget;
      let child = current.children[0];
      if(check === false){
        current.style.height = "150px";
        current.style.overflowY = "auto";
        child.style.color = "rgb(255, 255, 255)";
        child.style.backgroundColor = "rgb(255, 49, 49)";
        child.children[0].style.backgroundColor = "rgb(255, 49, 49)";
        child.children[0].style.border = "1px solid rgb(234, 234, 234)";
        child.children[2].style.backgroundColor = "rgb(255, 49, 49)";
        child.children[2].style.border = "1px solid rgb(255, 255, 255)";
        child.children[2].style.color = "rgb(255, 255, 255)";
      }
      else{
        if(current.style.height === "150px"){
          current.style.height = "40px";
          current.style.overflow = "hidden";
          child.className = "blockTop";
          child.style.backgroundColor = "rgb(255, 255, 255)";
          child.style.color = "rgb(104, 177, 255)";
          child.children[0].style.backgroundColor = "rgb(255, 255, 255)";
          child.children[0].style.border = "1px solid rgb(104, 177, 255)";
          child.children[2].style.backgroundColor = "rgb(255, 255, 255)";
          child.children[2].style.border = "1px solid rgb(104, 177, 255)";
          child.children[2].style.color = 'rgb(104, 177, 255)';
          clearInterval(timeMove);
        } else {
          timeOut();
          current.style.height = "150px";
          current.style.overflowY = "auto";
          child.className = "blockTopActive";
          child.style.backgroundColor = "rgb(104, 177, 255)";
          child.style.color = "rgb(255, 255, 255)";
          child.children[0].style.backgroundColor = "rgb(104, 177, 255)";
          child.children[0].style.border = "1px solid rgb(234, 234, 234)";
          child.children[2].style.backgroundColor = "rgb(104, 177, 255)";
          child.children[2].style.border = "1px solid rgb(234, 234, 234)";
          child.children[2].style.color = "rgb(255, 255, 255)";
        }
      }
      
    }}>
      <div className="blockTop">
        <div className='check' onClick={()=>{
          props.onDelect(props.num);
        }}></div>
        <span>{props.todo}</span>
        <div className='update' onClick={()=>{
          setCheck(true);
          clearInterval(timeMove);
          props.onUpdate(props.num);
        }} >Update</div>
      </div>
      <div className="blockBottom">
        <div className='dateBox'>
          <div className='dateSlide' onClick={event=>{
            if(event.currentTarget.style.marginTop !== '-40px'){
              timeOut();
              event.currentTarget.style.marginTop = '-40px';
            } else {
              event.currentTarget.style.marginTop = "0px";
              
            }
          }}>
            <div className='dateBlock'>
              <span style={left}>{props.date}</span>
              <span style={right}>{props.time}</span>
            </div>
            <div className='dateBlock'>
              <span style={left}>{limitDate}</span>
              <span style={right}>{limitTime}</span>
            </div>
          </div>
        </div>
        <p>{props.detail}</p>
      </div>
    </li>
  );
}

function UpdateForm(props){
  return (
    <div className='formDiv updateForm'>
      <form onSubmit={(event)=>{
        event.preventDefault();
        let target = event.target;
        if(target.todo.value === null || target.todo.value === '' || target.todo.value === ' '){
          alert('해야할 일을 입력해주세요.');
          return;
        }
        let selDate = new Date(target.date.value);
        if(target.date.value === ''){
          alert("시간을 입력해주세요.");
          return;
        }
        let now = new Date();
        if(selDate - now <= 0){
          alert("현재 이후를 선택해주세요.")
          return;
        }
        let time = selDate.toTimeString().substring(0, 9);
        props.onUpdateCalender(props.num, target.todo.value, target.detail.value, selDate.toLocaleDateString(), time);
      }}>
        <p>
          <input type="submit" value="To Do List!"/>
        </p>
        <label htmlFor="todo"><input id="todo" type="text" name="todo" placeholder="To Do" defaultValue={props.todo}/></label><br/>
        <label htmlFor="detail" ><textarea id="detail" name="detail" placeholder="Detail content" cols="22" rows="5" defaultValue={props.detail}></textarea></label><br/>
        <label htmlFor="date">Date <input id="date" type="datetime-local"/></label>
      </form>
    </div>
  );
}


// 실행 앱
function App() {
  const [id, nextId] = useState(0);
  const lis = [];
  const [calenders, setCalenders] = useState(lis);
  
  function overSchedule(){
    let now = new Date();
    let newlis = [];
    for(let i = 0; i < calenders.length; i++){
      let test = new Date(calenders[i].date + " " + calenders[i].time);
      if(test - now > 0){
        newlis.push(calenders[i]);
      }
    }
    setCalenders(newlis);
  }

  const [update, setUpdate] = useState(null);

  return (
    <div className="App">
      <ToDoForm onCalender={(todo, detail, date, time)=>{
        let added = {id : id, todo : todo, detail : detail, date : date, time : time}
        calenders.push(added);
        setCalenders(calenders);
        nextId(id + 1);
      }}></ToDoForm>
      <List calenders={calenders} onDelect={(id)=>{
        let newLis = [];
        for(let i = 0; i < calenders.length; i++){
          if(calenders[i].id !== id){
            newLis.push(calenders[i]);
          }
        }
        setCalenders(newLis);
      }} onUpdate={(id)=>{
        let updateCal = null;
        for(let i = 0; i < calenders.length; i++){
          if(calenders[i].id === id){
            updateCal = calenders[i];
            break;
          }
        }
        setUpdate(<UpdateForm num={updateCal.id} todo={updateCal.todo}
          detail={updateCal.detail} onUpdateCalender={(id, todo, detail, date, time)=>{
            let updatelis = [];
            for(let i = 0; i < calenders.length; i++){
              if(calenders[i].id === id){
                calenders[i].id = id;
                calenders[i].todo = todo;
                calenders[i].detail = detail;
                calenders[i].date = date;
                calenders[i].time = time;
              }
              updatelis.push(calenders[i]);
            }
            setCalenders(updatelis);
            setUpdate(null);
          }}></UpdateForm>);
      }}></List>
      {update}
    </div>
  );
}

export default App;