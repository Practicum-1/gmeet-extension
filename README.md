rooms={
roomName:{
participants:[
{user_id:'Qxy2flg23',displayName:'Shivansh'}
{user_id:'Qxy2flg23',displayName:'Shivansh'}
{user_id:'Qxy2flg23',displayName:'Shivansh'}
]
polls:[
{
poll_id number:1231412
text string:'Polling Question',
total_votes number_array:'number of votes'(6)
options:[
{option string:'option A', votes user_id:['','','']}
{option string:'option B',votes user_id:['''','']}
]
createdBy user_id:'Qzxyl4jhjkh4hkjd'
createdAt :date.now()
},
{
poll_id number:1231412
text string:'Polling Question',
total_votes number:'number of votes'(6)
options:[
{option string:'option A', votes user_id:['','','']}
{option string:'option B',votes user_id:['''','']}
]
createdBy user_id:'Qzxyl4jhjkh4hkjd'
createdAt :date.now()
}
]  
 }
}

event 1 -> cleared
event 2 -> socket.id, poll index, option index

polls[0]['options'][1]['votes'].push(socket.id)
