
<?php


	$inData = getRequestInfo();
	
	$conn = new mysqli("127.0.0.1", "Postman", "ThisIsAPI!", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ?");
		$stmt->bind_param("sssss", $inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["ID"]);
		$stmt->execute();
		$result = $stmt->get_result();

		returnWith("Edited Successfully");

		$stmt->close();
		$conn->close();
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
		$retValue = '{"Edited Successfully":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
