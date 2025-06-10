<?php
	$inData = getRequestInfo();
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$phone = $inData["Phone"];
	$email = $inData["Email"];
	$ID=$inData["ID"];

	$conn = new mysqli("127.0.0.1", "Postman", "ThisIsAPI!", "COP4331");
	if ($conn->connect_error) 
	{
		returnWith( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts(FirstName,LastName,Phone,Email,UserID) VALUES (?,?,?,?,?);");
		$stmt->bind_param("ssssi", $firstName, $lastName,$phone,$email,$ID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWith("Added Successfully!");
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
	
	function returnWith( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
