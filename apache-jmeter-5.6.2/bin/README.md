CSV Details

Note: 
	a) For every date field, the accepted format is ddmmyyyy.
	b) For selecting dropdown field option, we provide the exact text displayed on UI.

1. AdvanceSearch
	  i) 'username' & 'password' - Provide credentials for login. It is mandatory field.
	 ii) 'status' - Provide the exact text of the Status filter. It can be left blank.
	iii) Rest of the columns are the Advanced search fields.
	 iv) It is not mandatory to provide data for all columns. Only provide data for the fields you want the serach to be performed by.
	 
2. NewBusinessLoginDetails
	  i) It contains the credentials of Agent Role users, using which new policies will be created.
	  
3. NewBusinessPolicyInfo
	  i) It contains the fields necessary to provide Policy Information.
	  ii) 'currentDate' - Accpeted values for date should be in dd-mm format.
	  
4. NewBusinessDriverDetails
	  i) The driver count is driven by properties file.
	 ii) It contains all the header fields for adding max. 4 drivers.
	iii) We only need to fill the details for the desired count of drivers, like if we want to fill for 2 drivers, then the fields for driver3 and driver4 can be left empty.
	 iv) 'addViolation' - Accepted values for this column are either 'Yes' or 'No'. Provide it as 'Yes' if you want to add the violation details and vice-versa.
	  v) 'violationDateDriver<driverCount>', 'violationByDriver<driverCount>' and 'accidentWithViolationDriver<driverCount>' are only needed if 'addViolation' flag is 'Yes' otherwise these can be left empty.

5. NewBusinessVehicleDetails
	  i) The vehicle count is driven by properties file.
	 ii) It contains all the header fields for adding max. 5 vehicles.
	iii) 'garrageAddressSame' - Accepted values for this column are either 'Yes' or 'No'. Provide it as 'Yes' if the garaging address as same and vice-versa.
	 iv) 'garagingAddressVehicle<vehicleCount>', 'apartmentVehicle<vehicleCount>' and 'zipVehicle<vehicleCount>' are only needed if 'garrageAddressSame' is provided as 'No' otherwise these can be left empty.
	  v) 'lienHolder' - Accepted values for this column are either 'Yes' or 'No'. Provide it as 'Yes' if you want to add lienHolder details and vice-versa.
	 vi) 'lienHolderTypeVehicle<vehicleCount>', 'lienHolderNameVehicle<vehicleCount>, 'lienHolderAddressVehicle<vehicleCount>, 'lienHolderZipVehicle<vehicleCount>', 'lienHolderCityVehicle<vehicleCount>' and 'lienHolderStateVehicle<vehicleCount>' are only needed if 'lienHolder' is provided as 'Yes' otherwise these can left empty.

6. NewBusinessCoverageDetails
	  i) Additional Coverage details like 'medicalPaymentLimit', 'towingAndLabour' and 'rentalReimburse' are not mandatory. If user want to skip any/all of these then these can be left empty.

7. EndorsementDetails
	  i) 'primaryRole' - Provide the Agent Role via which the endorsement will be performed.
	 ii) If you want the endorsement to be done by Underwriter Role user, then we can keep the 'agentUsername' & 'agentPassword' fields empty, as it'll login using details from 'underwriterUsername' & 'underwriterPassword'.
	iii) 'underwriterAprrovalReq' - Accepted values for this column are either 'Yes' or 'No'. Provide it as 'Yes' if the endorsement required approval from Underwriter Role.
	 iv) 'editDriver' - Accepted values for this column are 'Add', 'Delete', 'Edit' and 'No', based on user preference whether we want to add, delete or edit the driver. If we do not want to make any changes in driver section we'll pass it as 'No'.
	  v) 'editVehicle' - Accepted values for this column are 'Add', 'Delete', 'Edit' and 'No', based on user preference whether we want to add, delete or edit the vehicle. If we do not want to make any changes in vehicle section we'll pass it as 'No'.
	 vi) 'underwriting' - Accepted values for this column are either 'Yes' or 'No'. Provide it as 'Yes' if underwriting screen will appear for endorsement i.e. if we are adding new driver/vehicle during endorsement, else provide it as 'No'.

8. CancellationDetails
	  i) 'primaryRole' - Provide the Agent Role via which the endorsement will be performed.
	 ii) If you want the endorsement to be done by Underwriter Role user, then we can keep the 'agentUsername' & 'agentPassword' fields empty, as it'll login using details from 'underwriterUsername' & 'underwriterPassword'.
	iii) 'underwriterAprrovalReq' - Accepted values for this column are either 'Yes' or 'No'. Provide it as 'Yes' if the endorsement required approval from Underwriter Role.
	
9. ReinstatementDetails
	  i) 'primaryRole' - Provide the Agent Role via which the endorsement will be performed.
	 ii) If you want the endorsement to be done by Underwriter Role user, then we can keep the 'agentUsername' & 'agentPassword' fields empty, as it'll login using details from 'underwriterUsername' & 'underwriterPassword'.
	iii) 'underwriterAprrovalReq' - Accepted values for this column are either 'Yes' or 'No'. Provide it as 'Yes' if the endorsement required approval from Underwriter Role.