
<?php


	$inData = getRequestInfo();
	$MatchCount = 0;

	$conn = new mysqli("127.0.0.1", "Postman", "ThisIsAPI!", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT COUNT(*) AS MatchCount FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?) AND UserID = ?");
		$allSearch = "%" . $inData["search"] . "%";
		$stmt->bind_param("sssss", $allSearch, $allSearch, $allSearch, $allSearch, $inData["userID"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['MatchCount']);
		}
		else
		{
			returnWithError("No Records Found");
		}

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
	
	function returnWithError( $err )
	{
		$retValue = '{"MatchCount":0,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $MatchCount )
	{
		$retValue = '{"MatchCount":' . $MatchCount . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
