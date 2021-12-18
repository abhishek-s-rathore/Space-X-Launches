import React from 'react';
import {Link} from 'react-router-dom';
import { withRouter} from 'react-router';
let moment = require('moment');



class Dashboard extends React.Component {

  constructor(props){
    super(props);

    this.state ={
      selectedQuery: 'All',
      launches:  null,
      currentLunches: null,
      initialIndex: 0,
    }
  }
  
  componentDidMount(){
       fetch('https://api.spacexdata.com/v3/launches')
       .then(res=> res.json())
       .then(launches=>{
         this.setState(prevState=>{
          return(
            this.state.launches  = launches )
         });
         this.setState(prevState=>{
          return(
              this.state.currentLaunches  = launches.splice(0, 12) )
         });
       })
  }



  success =(launch)=>{
    let case1 = launch.rocket.first_stage.cores[0].land_success;
    let case2 = launch.launch_success;
      
    if(case1 && case2){
          return(  <span className='span success'>Success</span>);
    }else{
      return(  <span className='span failure'>Failure</span>);
    }
  }

    setPageArr =(pages)=>{
        let arr = [];
        for(let i= 1; i<= pages; i++){
              arr.push(i);
        }
        return arr;
    }



    handleClick = (value)=>{
      this.setState(prevState=>{
        return( 
               this.state ={
                currentLaunches :this.state.launches.slice( value*12 , ((value*12)+12) ),
                initialIndex : value
               })
      });
    }  

  render() { 
    const{selectedQuery,currentLaunches, launches, initialIndex} = this.state;
    let pages = launches && Math.ceil(launches.length/12);
    let pageArr = this.setPageArr(pages);

         if(!currentLaunches){
            return (<><div className='container flex  justify-center align-center flex-direction-column loader ' >
              <div className="ripple-loader">
            <div></div>
            <div></div>
          </div>
          <br/>
          <p>Loading Data</p>
          </div></>);
         }
    return(
     <>
      <section className='container'>
        <table>
        <tr>
        <th>No.</th>
        <th>Launched (UTC)</th>
        <th>Location</th>
        <th>Mission</th>
        <th>Orbit</th>
        <th>Launch State</th>
        <th>Rocket</th>
      </tr>
  {currentLaunches.map((launch, index)=>{
       return( <tr>
        <td>{index+1}</td>
        <td className='time'>{moment(launch.launch_date_utc).format('YYYY-MM-DD') +' at '+ moment(launch.launch_date_utc).format('HH:MM')}</td>
        <td>{ launch.launch_site.site_name}</td>
        <td>{launch.mission_name.split(" ")[0]}</td>
        <td>{launch.rocket.second_stage.payloads[0].orbit}</td>
        <td>{launch.upcoming ? <span className='span upcoming'>Upcoming</span> : <>{this.success(launch)}</>}</td>
        <td>{launch.rocket.rocket_name}</td>
      </tr> );
  }) }
</table> 
<div className='flex justify-end align-center'>
  <span onClick={()=>this.handleClick(initialIndex > 0 ? initialIndex -1 : initialIndex)} className='page-butt page-btn page-left'><i className="fas fa-angle-left"></i></span>
   { pageArr ? pageArr.map(page=>{
    return (<> <span className={initialIndex + 1 === page ?'page-butt page-act': 'page-butt' }>{page}</span></>);
  }) : ''}
  <span onClick={()=>this.handleClick(initialIndex < (pageArr.length-1) ? initialIndex + 1 : initialIndex)} className='page-butt page-btn page-right'><i className="fas fa-angle-right"></i></span>
</div>
      </section>
     </>
   );
  }
}

export default withRouter(Dashboard);
