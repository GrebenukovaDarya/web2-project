

    <table>
        <thead> 
            <tr>
                <td>ID</td><td>LOGIN</td><td>FIO</td><td>NUMBER</td><td>EMAIL</td><td>GENDER</td><td>BIO</td><td>DATA</td><td>CHECK</td><td>LANGUAGES</td><td>CHANGE</td>
            </tr>
        </thead> 

        <tbody>
            <?php
                foreach($user_table as $row){
                    echo $row;
                }
            ?>
        </tbody>
    </table>

    <table>
        <thead> 
            <tr><td>LANGUAGE</td><td>Q</td></tr>
        </thead> 
        <tbody>
            <?php
                foreach($language_table as $row){
                    echo $row;
                }
            ?>
        </tbody>
    </table>