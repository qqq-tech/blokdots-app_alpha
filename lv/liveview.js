

// a json object to always know about all slots
var allSlots = [];

function initSlots(){


  const Slots = [2,3,4,5,6,7,8,'A0','A1','A2','A3'];
  const Container = $('#slot-wrapper section');

  var i = 0;


  Slots.forEach(function(slot){

    // insert a JSON object for each slot
    allSlots[ i ] = {
      'slot'  : slot,
      'state' : 'empty',
      'var'   : null,
      'comp'  : null,
      'type'  : null,
      'dir'   : null
    }

    var displaySlot = slot;
    if ( $.isNumeric( displaySlot ) ){
      displaySlot = 'D'+displaySlot;
    }

    var m = '<div class="slot" slot="'+slot+'">';
          m+= '<div class="controls">';
            m+= '<div class="indicator"></div>';
            m+= '<div class="number">'+displaySlot+'</div>';
            m+= '<div class="info">// Not Connected</div>';
            m+= '<div class="btn use_btn ghost-dark">Setup</div>';
          m+= '</div>';
        m+= '</div>';

    Container.append(m);

    i++;

  });

  $('.slot').each(function(){
    slotState( $(this) , 'empty' );
  });

}

// displays if board is connected ----------------------------


function initBlokdotsConnectionIndicator(){

  var m = '<div class="connection"></div>';
  $('#grove_1 .separator').append(m);

}

function blokdotsConnectionIndicator( bool ){

  const conn = $('#grove_1 .connection');

  if( bool ){

    conn.addClass('connected');
    conn.text('board connected')
  }else{

    conn.removeClass('connected');
    conn.text('device not found')
  }
}


// apply new components to board ------------------------------------

function connectSlot( slot ){


  // get slot number and check if int
  var groveSlot = slot.attr('slot');
  if( groveSlot.indexOf('A') < 0 ){
    groveSlot = parseInt(groveSlot);
  }

  slotState( slot , 'setup' );

  appendSetupComponentList( slot , groveSlot );

}



function disconnectSlot(slot){

  slotState( slot , 'empty' );


  // clear database again
  for(var i = 0; i < allSlots.length; i++){

    var curr = allSlots[i];
    if(curr.slot == slot){
      
      curr.state  = 'empty';
      curr.var    = null;
      curr.comp   = null;
      curr.type   = null;
      curr.dir    = null;
    }
  }

}


// Slot states

function slotState( slot , state ){

  slot.removeClass('empty setup inUse');
  $('.setup-component-list').remove();

  switch (state){

    case 'empty':

      // remove possible other elements
      slot.find('.info').html('// Not Connected');
      slot.find('.use_btn').addClass('ghost-dark').removeClass('ghost-light').text('Setup');

    break;
    case 'setup':

      // just allow one slot to be in setup mode
      slotState( $('.slot.setup') , 'empty' );

      slot.find('.info').text('Select component from list');
      slot.find('.use_btn').text('Cancel');
      slot.find('.use_btn').removeClass('ghost-dark').addClass('ghost-light');

    break;
    case 'inUse':

      var slotObj;

      // find the equivalent slot object
      for(var i = 0; i < allSlots.length; i++){
        var curr = allSlots[i];
        if(curr.slot == slot.attr('slot') ){
          slotObj = curr;
        }
      }

      slot.find('.info').empty();
      slot.find('.use_btn').removeClass('ghost-light').text('Use');

      setupSlotControls( slot , slotObj.comp );
      buildLiveViewDisplayListener( slotObj );

    break;

  }

  slot.addClass(state);

  // slot.append(m);

}


// Select slot

function appendSetupComponentList( slotObj , slotNum ){

  // check which type the selected slot has
  var slotType = slotObj.attr('slot');
  if ( $.isNumeric( slotType ) ){
    slotType = 'digital';
  }else{
    slotType = 'analog';
  }

  var m = '<div class="setup-component-list" to-slot="'+slotNum+'">';
      m+= '<ul>';
  

  // list all components available in library
  for( i=0 ; i < componentList.length ; i++ ){
    
    const component = componentList[i];
    
    this.comp = component["component"];
    this.type = component["type"];
    this.dir  = component["dir"];
    this.img  = component["image_url"];

    // just list if suitable for slot
    if( slotType == this.type ){
  
      m+= '<li comp="'+this.comp+'">';

        m+= '<img class="component-icon" src="../global/img/comp/'+this.img+'.svg"/>';

        m+= '<div class="name">'+this.comp+'</div>';

      m+= '</li>';

    }
  }

  m+= '</ul>';
  m+= '</div>';

  // add list to slot
  slotObj.append(m);

}
// Input events

function buttonEventsLiveViewSlots(){

  // use button within 
  $('.slot').on('click','.use_btn',function(){

    const slot = $(this).closest('.slot');

    if( slot.hasClass('empty') ){
      connectSlot( slot );
    }else if( slot.hasClass('setup') ){
      disconnectSlot( slot );
    }

  });


  $('body').on('click','.setup-component-list li',function(){

    var el = $(this);
    var slot = el.closest('.setup-component-list').attr('to-slot');
    var comp = el.attr('comp');

    setupComponent( slot , comp );

    slotState( $('.slot.setup') , 'inUse' );

  });

}

// bind slot to johnny-five object
function setupComponent( slot , comp ){

  console.log('%c'+slot + ' -> ' + comp , 'color: #c1c1c1;' );
  
  // build correct value for slot
  if ( $.isNumeric( slot ) ){
    slot = parseInt(slot);
  }

  var componentTypeObject;
  for(var i = 0; i < componentList.length; i++){
    var curr = componentList[i];
    if(curr.component == comp){
      componentTypeObject = curr;
    }
  }

  // generate a variable for the slot
  var varname = 'slot'+slot;

  switch( comp ){

    case 'Button':

      window[varname] = new five.Button( slot );

    break;

    case 'LED':

      window[varname] = new five.Led( slot );

    break;

    case 'Potentiometer':

      window[varname] = new five.Sensor( slot );

    break;

    default:

      console.log('sorry, does not exist yet…');

    break;
  }


  for(var i = 0; i < allSlots.length; i++){

    var curr = allSlots[i];
    if(curr.slot == slot){
      
      curr.state  = 'inUse';
      curr.var    = varname;
      curr.comp   = comp;
      curr.type   = componentTypeObject.type;
      curr.dir    = componentTypeObject.dir;

    }
  }
}


// build html markup to insert in slot -> returns string
function setupSlotControls( slot , comp ){

  // find the values for this component type
  var componentTypeObject;
  for(var i = 0; i < componentList.length; i++){
    var curr = componentList[i];
    if(curr.component == comp){
      componentTypeObject = curr;
    }
  }

  var img = '<img class="component-icon" src="../global/img/comp/'+componentTypeObject.image_url+'.svg"/>';
  slot.find('.controls').append( img );

  var typeIndicator = '<div class="type-indicator '+comp.type+' '+comp.dir+'">'+comp.type+'</div>';
  slot.find('.controls').append( typeIndicator );


  var m = '';

  switch( comp ){

    case 'Button':
    case 'Potentiometer':

      m+= '<div class="value-container">';
        m+= '<div class="value">10</div>'
      m+= '</div>';
      m+= '<div class="value-bar-container">';
        m+= '<div class="value-bar"></div>';
      m+= '</div>';
      m+= '<div class="real-value"></div>';

    break;

    case 'LED':


    break;

    default:

      m+= 'not ready yet…';

    break;
  }


  slot.find('.info').append(m);

  
}


function buildLiveViewDisplayListener( slotObj ){

  switch( slotObj.comp ){

    case 'Button':
    
      window[ slotObj.var ] = new five.Button( slotObj.slot );

      button_LiveViewDisplayListener( 0 , slotObj.slot );

      window[ slotObj.var ].on("down", function() {
        button_LiveViewDisplayListener( 1 , slotObj.slot );
      });
      window[ slotObj.var ].on("up", function() {
        button_LiveViewDisplayListener( 0 , slotObj.slot );
      });

    break;

    case 'Potentiometer':

      window[ slotObj.var ] = new five.Sensor( slotObj.slot );

      window[ slotObj.var ].on("change", function(val) {
        potentiometer_LiveViewDisplayListener( val , slotObj.slot );
      });

    break;

    default:

      console.log('not ready yet…');

    break;
  }
}


// Functions for different component types -------------------------------------

function button_LiveViewDisplayListener( val , slot ){

  var slotDOM;
  $('.slot').each(function(){
    if( $(this).attr('slot') == slot ){
      slotDOM = $(this);
    }
  });

  slotDOM.find('.value').html( val );
  slotDOM.find('.real-value').html( val );
  slotDOM.find('.value-bar').css( 'width' , (val / 1)*100+'%' );
  
}

function potentiometer_LiveViewDisplayListener( val , slot ){

  var slotDOM;
  $('.slot').each(function(){
    if( $(this).attr('slot') == slot ){
      slotDOM = $(this);
    }
  });

  val = 1023 - val;
  var valPercentage = Math.round( 100 * (val/1024) ) +"%";

  slotDOM.find('.value').html( valPercentage );
  slotDOM.find('.real-value').html( val );
  slotDOM.find('.value-bar').css( 'width' , valPercentage );
  
}




// Run functions
$(document).ready(function(){

  // Layout Functions
  initSeparators();
  initBlokdotsConnectionIndicator();

  // Slots
  initSlots();
  buttonEventsLiveViewSlots();

  blokdotsConnectionIndicator( connected );

});