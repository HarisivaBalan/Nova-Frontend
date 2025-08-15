// import { useSelector } from "react-redux"
// import { Link } from "react-router-dom";

// export default function Profile(){
//     const {user}=useSelector(state=>state.authState.user);
//     return (
        
//         <div className="row justify-content-around mt-5 user-info">
//             <div className="col-12 col-md-3">
//                 <figure id='myprofile_avatar'>
//                     <img className="rounded-circle img-fluid" src={user.avatar ?? '/images/default_avatar.png'} alt='myavatar'
//                     style={{ width: '400px', height: '300px' }} />
//                 </figure>
//                 <Link to="/myprofile/update" id="edit_profile" className="btn btn-primary btn-block my-5">
//                     Edit Profile
//                 </Link>
//             </div>
     
//             <div className="col-12 col-md-5" id="myprofile_details">
//                  <h4>Full Name</h4>
//                  <p>{user.name}</p>
     
//                  <h4>Email Address</h4>
//                  <p>{user.email}</p>

//                  <h4>Account Created at</h4>
//                  <p>{String(user.createdAt).substring(0,10)}</p>

//                  <Link to='/orders' className="btn btn-danger btn-block mt-4 mb-7  me-3">
//                     My Orders
//                 </Link>

//                 <Link to="/myprofile/update/password " className="btn btn-primary btn-block mt-4 ml-3">
//                     Change Password
//                 </Link>
//             </div>
//         </div>
   
//     )
// }
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
    const {user} = useSelector(state => state.authState);

    return (
        <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 d-flex flex-column" style={{ marginTop: "100px" }}>
        <div className="row justify-content-around mt-8 user-info">
            <div className="col-12 col-md-3">
                <figure id='myprofile_avatar'>
                    <img
                        className="rounded-circle img-fluid"
                        src={user?.avatar ?? '/images/default_avatar.png'}
                        alt='myavatar'
                        style={{ width: '400px', height: '300px' }}
                    />
                </figure>
                <Link to="/myprofile/update" id="edit_profile" className="btn btn-primary btn-block my-5">
                    Edit Profile
                </Link>
            </div>

            <div className="col-12 col-md-5" id="myprofile_details">
                <h4>Full Name</h4>
                <p>{user?.name}</p>

                <h4>Email Address</h4>
                <p>{user?.email}</p>

                <h4>Account Created at</h4>
                <p>{String(user?.createdAt).substring(0, 10)}</p>

                <Link to='/orders' className="btn btn-danger btn-block mt-4 mb-7 me-3">
                    My Orders
                </Link>

                <Link to="/myprofile/update/password" className="btn btn-primary btn-block mt-4 ml-3">
                    Change Password
                </Link>
            </div>
        </div>
        </div>
        </div>
    );
}
