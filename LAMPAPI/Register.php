<?php

	$inData = getRequestInfo();
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$username = $inData["username"];
	$password=$inData["password"];

	$conn = new mysqli("127.0.0.1", "Postman", "ThisIsAPI!", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithConnectError( $conn->connect_error );
	} 
	else
	{

		// Search database for username to see if already exists
		$stmt = $conn->prepare("SELECT * FROM Users WHERE BINARY Login = ?");
		$stmt->bind_param("s", $username);
		$stmt->execute();
		$result = $stmt->get_result();

		// If username does not exist in users table
		if($result->num_rows === 0)
		{
			$stmt->close();
			// Since user is not found in system already, add the user details to system
			$stmt = $conn->prepare("INSERT into Users(FirstName,LastName,Login,Password) VALUES (?,?,?,?)");
			$stmt->bind_param("ssss", $firstName, $lastName,$username,$password);
			$stmt->execute();
			$stmt->close();
			


			// Because we don't have the ID of the new user that was just added, retrieve ID of new user for successful login
			$stmt = $conn->prepare("SELECT ID, firstName, lastName FROM Users WHERE BINARY Login = ? AND BINARY Password = ?");
			$stmt->bind_param("ss", $username, $password);
			$stmt->execute();
			$result = $stmt->get_result();


			// Log the user in with this data, just like a normal login with all of the details
			if( $row = $result->fetch_assoc()  )
			{
				returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
			}
			else
			{
				returnWithTransferError("Please login on the login page");
			}


			$stmt->close();
			$conn->close();
			
			
			

		}
		else
		{
			$stmt->close();
			$conn->close();
			// Return with error that prevents user from registering again
			returnWithDuplicateError("Username already found");
		}
			

	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithTransferError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithDuplicateError( $err )
	{
		$retValue = '{"id":0.1,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithConnectError( $err )
	{
		$retValue = '{"id":0.2,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}


?>
