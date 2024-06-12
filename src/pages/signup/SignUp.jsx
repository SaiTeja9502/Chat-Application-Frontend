import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";

const SignUp = () => {
	const [inputs, setInputs] = useState({
		phoneNumber: "",
		userName: "",
		password: "",
		confirmPassword: "",
		securityQuestion: "", 
        securityAnswer: ""
	});

	const { loading, signup } = useSignup();


	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(inputs);
		console.log(inputs);
	};

	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold text-center text-gray-300'>
					Sign Up <span className='text-blue-500'> ChatApp</span>
				</h1>

				<form onSubmit={handleSubmit}>
					<div>
						<label className='label p-2'>
							<span className='text-base label-text'>Phone Number</span>
						</label>
						<input
							type='tel'
							placeholder='Phone Number'
							className='w-full input input-bordered  h-10'
							pattern="[0-9]{10}"
							value={inputs.phoneNumber}
							onChange={(e) => setInputs({ ...inputs, phoneNumber: e.target.value })}
						/>
					</div>

					<div>
						<label className='label p-2 '>
							<span className='text-base label-text'>Username</span>
						</label>
						<input
							type='text'
							placeholder='Enter User Name'
							className='w-full input input-bordered h-10'
							value={inputs.userName}
							onChange={(e) => setInputs({ ...inputs, userName: e.target.value })}
						/>
					</div>

					<div>
						<label className='label'>
							<span className='text-base label-text'>Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='w-full input input-bordered h-10'
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
						/>
					</div>

					<div>
						<label className='label'>
							<span className='text-base label-text'>Confirm Password</span>
						</label>
						<input
							type='password'
							placeholder='Confirm Password'
							className='w-full input input-bordered h-10'
							value={inputs.confirmPassword}
							onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
						/>
					</div>

					{/* Security Question */}
                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Security Question</span>
                        </label>
                        <select
                            className='w-full input input-bordered h-10'
                            value={inputs.securityQuestion}
                            onChange={(e) => setInputs({ ...inputs, securityQuestion: e.target.value })}
                        >
                            <option value="">Select a security question</option>
                            <option value="What's your favourite Place?">What's your favourite Place?</option>
                            <option value="What's your favourite Food?">What's your favourite Food?</option>
							<option value="What's your Pet's name?">What's your Pet's name?</option>
							<option value="What's your favourite Show?">What's your favourite Show?</option>
                        </select>
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Security Answer</span>
                        </label>
                        <input
                            type='text'
                            placeholder='Enter Security Answer'
                            className='w-full input input-bordered h-10'
                            value={inputs.securityAnswer}
                            onChange={(e) => setInputs({ ...inputs, securityAnswer: e.target.value })}
                        />
                    </div>

					{/* <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} /> */}

					<Link
						to={"/login"}
						className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'
						href='#'
					>
						Already have an account?
					</Link>

					<div>
						<button className='btn btn-block btn-sm mt-2 border border-slate-700' disabled={loading}>
							{loading ? <span className='loading loading-spinner'></span> : "Sign Up"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default SignUp;
